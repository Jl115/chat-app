"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const groups = [
      { groupName: "Gaming", groupChatKey: "gaming-key" },
      { groupName: "Live", groupChatKey: "live-key" },
      { groupName: "Sports", groupChatKey: "sports-key" },
      { groupName: "Music", groupChatKey: "music-key" },
      { groupName: "Movies", groupChatKey: "movies-key" },
      { groupName: "Tech", groupChatKey: "tech-key" },
      { groupName: "Travel", groupChatKey: "travel-key" },
      { groupName: "Education", groupChatKey: "education-key" },
      { groupName: "Cooking", groupChatKey: "cooking-key" },
      { groupName: "Fitness", groupChatKey: "fitness-key" },
      { groupName: "Health", groupChatKey: "health-key" },
      { groupName: "News", groupChatKey: "news-key" },
      { groupName: "Books", groupChatKey: "books-key" },
      { groupName: "Art", groupChatKey: "art-key" },
      { groupName: "Photography", groupChatKey: "photography-key" },
      { groupName: "Fashion", groupChatKey: "fashion-key" },
      { groupName: "Nature", groupChatKey: "nature-key" },
      { groupName: "Science", groupChatKey: "science-key" },
      { groupName: "History", groupChatKey: "history-key" },
      { groupName: "Politics", groupChatKey: "politics-key" },
    ];

    const timestamp = new Date();
    const groupsWithTimestamps = groups.map((group) => ({
      ...group,
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    await queryInterface.bulkInsert("Groups", groupsWithTimestamps, {});
  },

  async down(queryInterface, Sequelize) {
    const groupNames = [
      "Gaming",
      "Live",
      "Sports",
      "Music",
      "Movies",
      "Tech",
      "Travel",
      "Education",
      "Cooking",
      "Fitness",
      "Health",
      "News",
      "Books",
      "Art",
      "Photography",
      "Fashion",
      "Nature",
      "Science",
      "History",
      "Politics",
    ];
    await queryInterface.bulkDelete(
      "Groups",
      {
        groupName: groupNames,
      },
      {}
    );
  },
};
