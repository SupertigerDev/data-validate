const express = require("express");
const { ValidateData } = require("../build")


const app = express();

app.post("/register", (req, res) => {

  ValidateData.validate(req.body)
    .string("username", { min: 2, max: 35, required: true })
    .object("info", validate =>
      validate
        .number("created", { min: 4, max: 3000, required: true })
        .boolean("blocked", true)
    )
    .array("friends", (validate, index) =>
      validate.string(index, { min: 0, max: 250 })
    );
  const errors = validate.done(res)
  if (errors) return;

  someDB.createUser(req.body);

});



app.listen(80, () => {
  console.log("Listening on port 80");
});