var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Student", // Will use table name `category` as default behaviour.
    tableName: "students", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        marks: {
            type: "int"
        }
    }
});