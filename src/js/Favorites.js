import GithubUser from "./GithubUser.js";

class Favorites {
   constructor(root) {
      this.root = document.querySelector(root);
      this.load();
   }

   async add(username) {
      try {
         const alreadyAdded = this.users.find(
            (user) => user.login === username
         );

         if (alreadyAdded) {
            throw new Error(`User '${username}' already added!`);
         }

         const user = await GithubUser.search(username);

         if (!user.login) {
            throw new Error(`User '${username}' not found!`);
         }

         this.users = [user, ...this.users];
         this.update();
         this.saveOnLS();
      } catch (error) {
         alert(error);
      }
   }

   saveOnLS() {
      localStorage.setItem("@gh-favorites:", JSON.stringify(this.users));
   }

   load() {
      this.users = JSON.parse(localStorage.getItem("@gh-favorites:")) || [];
   }

   delete(username) {
      const u = this.users.findIndex((user) => user.login === username);

      this.users.splice(u, 1);
      this.update();
      this.saveOnLS();
   }
}

class FavoritesView extends Favorites {
   constructor(root) {
      super(root);

      this.tbody = this.root.querySelector("tbody");

      this.update();
      this.onAdd();
   }

   onAdd() {
      const addButton = this.root.querySelector("#search button");

      addButton.onclick = (ev) => {
         ev.preventDefault();
         const input = this.root.querySelector("#search input");

         if (input.value) {
            this.add(input.value);
            input.value = "";
         }
      };
   }

   update() {
      this.delAllTr();

      this.users.forEach((user) => {
         const row = this.createRow();
         const img = row.querySelector(".user img");
         const a = row.querySelector(".user a");
         const name = row.querySelector(".user a p");
         const username = row.querySelector(".user a span");
         const repos = row.querySelector("td.repositories");
         const followers = row.querySelector("td.followers");
         const delButton = row.querySelector(".delete");

         img.src = `https://github.com/${user.login}.png`;
         img.alt = `${user.name}'s image`;

         a.href = `https://github.com/${user.login}`;

         name.innerText = user.name;
         username.innerText = user.login;
         repos.innerText = user.public_repos;
         followers.innerText = user.followers;

         delButton.onclick = () => this.delete(user.login);

         this.tbody.append(row);
      });
   }

   createRow() {
      const tr = document.createElement("tr");
      const trContent = `
      <td class="user">
         <img src="">
         <a href="" target="_blank">
            <p>Name</p>
            <span>Username</span>
         </a>
      </td>
      <td class="repositories">
         30
      </td>
      <td class="followers">
         100
      </td>
      <td>
         <button class="delete">&times;</button>
      </td>
      `;

      tr.innerHTML = trContent;
      return tr;
   }

   delAllTr() {
      const tr = this.tbody.querySelectorAll("tr");

      tr.forEach((tr) => {
         tr.remove();
      });
   }
}

export default FavoritesView;
