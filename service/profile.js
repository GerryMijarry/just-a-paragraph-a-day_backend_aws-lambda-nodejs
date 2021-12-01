const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "apad-users";

const util = require("../utils/util");
const auth = require("../utils/auth");

function updateProfile(profileBody) {
  if (!profileBody.user || !profileBody.user.username || profileBody.token) {
    return util.buildResponse(401, {
      verified: false,
      message: "incorrect request body",
    });
  }
  const user = profileBody.user;
  const token = profileBody.token;
  const verification = auth.verifyToken(user.username, token);

  const name = user.name;
  const email = user.email;
  const username = user.username;
  const penname = user.penname;

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: "Server Error. Please try again",
    });
  }

  return util.buildResponse(200, {
    verified: true,
    message: "success",
    user: user,
    token: token,
  });
}

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("There is an error saving the user:", error);
      }
    );
}

module.exports.profile = profile;
