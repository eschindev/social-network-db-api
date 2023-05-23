const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { getRandomName } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  await User.deleteMany({});

  await Thought.deleteMany({});

  const users = [];

  for (let i = 0; i < 20; i++) {
    const username = getRandomName();
    const email = `${username.split(" ")[0]}${Math.floor(
      Math.random() * 99
    )}@gmail.com`;
    const password = `${username.split(" ")[0]}${Math.floor(
      Math.random() * 99
    )}`;

    users.push({
      username,
      email,
      password,
    });
  }

  await User.create(users);

  const usersFromDb = await User.find();

  const thoughts = [];

  for (let i = 0; i < 20; i++) {
    const thoughtText = `${i} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    const username = usersFromDb[Math.floor(Math.random() * 20)].username;
    const reactions = [
      {
        reactionBody: `${i} this is dope`,
        username: usersFromDb[Math.floor(Math.random() * 20)].username,
      },
      {
        reactionBody: `${i} I don't like this`,
        username: usersFromDb[Math.floor(Math.random() * 20)].username,
      },
    ];
    thoughts.push({ thoughtText, username, reactions });
  }

  await Thought.collection.insertMany(thoughts);

  const thoughtsFromDb = await Thought.find();
  const thoughtIds = thoughtsFromDb.map((thought) => thought._id);

  const userIds = usersFromDb.map((user) => user._id);

  for (let i = 0; i < 20; i++) {
    const randomUserIds = userIds.filter(
      (id) => id !== userIds[i] && Math.random() > 0.5
    );
    await User.findOneAndUpdate(
      { _id: userIds[i] },
      { $set: { friends: randomUserIds } }
    );
  }

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
