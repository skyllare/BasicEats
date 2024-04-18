
CREATE TABLE IF NOT EXISTS USER ( username TEXT PRIMARY KEY NOT NULL, password TEXT NOT NULL, admin BOOLEAN NOT NULL DEFAULT 0, recipe_count INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS MEALPLAN ( username TEXT NOT NULL, day DATE NOT NULL, weekday TEXT NOT NULL, mealNum INT NOT NULL, name TEXT NOT NULL, PRIMARY KEY (username, day, mealNum), recipeID INTEGER PRIMARY KEY);
CREATE TABLE IF NOT EXISTS RECIPE ( recipeid INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT, username TEXT NOT NULL, recipename TEXT NOT NULL, ingredients TEXT NOT NULL, recipedesc TEXT, instructions TEXT NOT NULL, time INTEGER );
CREATE TABLE IF NOT EXISTS SAVED_RECIPE ( recipeid INTEGER PRIMARY KEY NOT NULL, username TEXT PRIMARY KEY NOT NULL, recipename TEXT)

DELETE FROM USER;
DELETE FROM MEALPLAN;
DELETE FROM RECIPE;
DELETE FROM SAVED_RECIPE;

INSERT INTO USER VALUES ('subu', '1234');
INSERT INTO MEALPLAN VALUES ( 'subu', '2024-04-11', 'Friday', 1, "eggs" );
INSERT INTO MEALPLAN VALUES ( 'subu', '2024-04-12', 'Friday', 1, "friday" );CREATE TABLE IF NOT EXISTS RECIPE ( recipeid INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT, username TEXT NOT NULL, recipename TEXT NOT NULL, ingredients TEXT NOT NULL, recipedesc TEXT, instructions TEXT NOT NULL, time INTEGER );

INSERT INTO RECIPE VALUES(1, 'subu', 'salad', 'lettuce, dressing, croutons, strawberries, candied pecans', 'strawberry salad perfect for summer', 'instructions: 1. Candy pecans \n 2. Clean strawberries and chop them \n 3. Chop lettuce \n 4. Put ingredients in a bowl and toss \n 5. Add dressing', 20 );
INSERT INTO SAVED_RECIPE VALUES (661340, 'subu', 'Spinach Salad with Strawberry Vinaigrette');

