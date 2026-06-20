async function testGitHubConnection() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      configured: false,
      ok: false,
      message: 'GITHUB_TOKEN ist nicht gesetzt.'
    };
  }

  const res = await fetch('https://api.github.com/user', {
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2026-03-10'
    }
  });

  if (!res.ok) {
    return {
      configured: true,
      ok: false,
      status: res.status,
      message: 'GitHub API Test fehlgeschlagen.'
    };
  }

  const data = await res.json();
  return {
    configured: true,
    ok: true,
    login: data.login,
    id: data.id,
    url: data.html_url
  };
}

module.exports = {
  testGitHubConnection
};
