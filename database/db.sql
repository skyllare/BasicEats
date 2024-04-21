
CREATE TABLE IF NOT EXISTS USER ( username TEXT PRIMARY KEY NOT NULL, password TEXT NOT NULL, admin BOOLEAN NOT NULL DEFAULT 0, recipe_count INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS MEALPLAN ( username TEXT NOT NULL, day DATE NOT NULL, weekday TEXT NOT NULL, mealNum INT NOT NULL, name TEXT NOT NULL, PRIMARY KEY (username, day, mealNum), recipeID INTEGER PRIMARY KEY);
CREATE TABLE IF NOT EXISTS RECIPE ( recipeid INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT, username TEXT NOT NULL, recipename TEXT NOT NULL, ingredients TEXT NOT NULL, recipedesc TEXT, instructions TEXT NOT NULL, time INTEGER, servings INTEGER DEFAULT 2);
CREATE TABLE IF NOT EXISTS SAVED_RECIPE ( recipeid INTEGER PRIMARY KEY NOT NULL, username TEXT PRIMARY KEY NOT NULL, recipename TEXT)

DELETE FROM USER;
DELETE FROM MEALPLAN;
DELETE FROM RECIPE;
DELETE FROM SAVED_RECIPE;

INSERT INTO USER VALUES ('subu', '1234');
INSERT INTO MEALPLAN VALUES ( 'subu', '2024-04-11', 'Friday', 1, "eggs" );
INSERT INTO MEALPLAN VALUES ( 'subu', '2024-04-12', 'Friday', 1, "friday" );CREATE TABLE IF NOT EXISTS RECIPE ( recipeid INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT, username TEXT NOT NULL, recipename TEXT NOT NULL, ingredients TEXT NOT NULL, recipedesc TEXT, instructions TEXT NOT NULL, time INTEGER );

INSERT INTO RECIPE VALUES(1, 'subu', 'Chicken Gnocchi Soup', '3-4 boneless skinless chicken breasts - cooked and diced, 1 stalk of celery - chopped, 1/2 white onion - diced, 2 tsp minced garlic, 1/2 cup shredded carrots, 1 tbsp olive oil, 4 cups low sodium chicken broth, salt and pepper - to taste, 1 tsp thyme, 16 ounces potato gnocchi, 2 cups half and half, 1 cup fresh spinach - roughly chopped ', 'Olive Garden Chicken Gnocchi Soup copycat is every bit as creamy and delicious as the restaurant version, made in less than 30 minutes! ', '<ol><li>Heat olive oil in a large pot over medium heat. Add celery, onions, garlic, and carrots and saute for 2-3 minutes until onions are translucent. </li><li>Add chicken, chicken broth, salt, pepper, and thyme, bring to a boil, then gently stir in gnocchi. Boil for 3-4 minutes longer before reducing heat to a simmer and cooking for 10 minutes.</li><li>Stir in half and half and spinach and cook another 1-2 minutes until spinach is tender. Taste, add salt and pepper if needed, and serve.</ol>', 30, 4);
INSERT INTO SAVED_RECIPE VALUES (649933, 'subu', 'Lentil Soup with Chorizo');

