const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { getRandomName } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  await User.deleteMany({});

  await Thought.deleteMany({});

  const thoughts = [];

  for (let i = 0; i < 20; i++) {
    const text = `${i} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    const thought = { text };
    thoughts.push(thought);
  }

  await Thought.collection.insertMany(thoughts);

  const thoughtsFromDb = await Thought.find();
  const thoughtIds = thoughtsFromDb.map((thought) => thought._id);

  const users = [];

  for (let i = 0; i < 20; i++) {
    const name = getRandomName();
    const email = `${name.split(" ")[0]}${Math.floor(
      Math.random() * 99
    )}@gmail.com`;
    const password = `${name.split(" ")[0]}${Math.floor(Math.random() * 99)}`;

    users.push({
      name,
      email,
      password,
      thoughts: [thoughtIds[i]],
    });
  }

  await User.create(users);

  const usersFromDb = await User.find();

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
