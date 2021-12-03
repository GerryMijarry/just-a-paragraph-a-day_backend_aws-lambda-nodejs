const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "apad-books";

const util = require("../utils/util");
const auth = require("../utils/auth");

function addBook(bookBody) {
  if (!bookBody.book || !bookBody.book.username || bookBody.token) {
    return util.buildResponse(401, {
      verified: false,
      message: "incorrect request body",
    });
  }
  const book = bookBody.book;
  const token = bookBody.token;
  const verification = auth.verifyToken(book.username, token);

  const title = book.title;
  const description = book.description;
  const dailyParagraphs = book.dailyParagraphs;
  const dailyReminder = book.dailyReminder;

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const saveBookResponse = await saveBook(book);
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

async function saveBook(book) {
  const params = {
    TableName: bookTable,
    Item: book,
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

module.exports.book = book;
