class GithubUser {
   static search(username) {
      const url = `https://api.github.com/users/${username}`;

      return fetch(url)
         .then((data) => data.json())
         .then((data) => {
            const { login, name, public_repos, followers } = data;

            return {
               login,
               name,
               public_repos,
               followers,
            };
         });
   }
}

export default GithubUser;
