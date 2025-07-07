import { Octokit } from '@octokit/rest';

console.log('GITHUB_REPO:', process.env.GITHUB_REPO);
if (!process.env.GITHUB_REPO) {
  throw new Error('GITHUB_REPO is not set. Did you forget to create a .env file or call dotenv.config()?');
}

// Add this missing line - Create the Octokit instance
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const [owner, repo] = process.env.GITHUB_REPO.split('/');

export async function getProblemsJson() {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'problems.json',
    });
    const content = Buffer.from(data.content, 'base64').toString();
    return JSON.parse(content);
  } catch (err) {
    if (err.status === 404) return [];
    throw err;
  }
}

export async function addProblemToRepo(problem, solutionFile) {
  // 1. Get current problems.json
  const problems = await getProblemsJson();
  problems.push(problem);
  const problemsContent = Buffer.from(JSON.stringify(problems, null, 2)).toString('base64');

  // 2. Get SHA for problems.json (if exists)
  let sha = undefined;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: 'problems.json' });
    sha = data.sha;
  } catch (err) { /* file may not exist */ }

  // 3. Update problems.json
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'problems.json',
    message: `Add problem: ${problem.title} (${problem.filename})`,
    content: problemsContent,
    sha,
  });

  // 4. Upload solution file
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: `solutions/${problem.filename}`,
    message: `Add solution: ${problem.title} (${problem.filename})`,
    content: solutionFile.buffer.toString('base64'),
  });
}