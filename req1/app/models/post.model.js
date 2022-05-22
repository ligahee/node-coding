module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      authorid: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      }
    });
  
    return Post;
  };
  