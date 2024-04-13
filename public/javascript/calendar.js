
function displayMeal(day, mealNumber) {
    fetch(`/meal/${day}/${mealNumber}`)
        .then(response => response.text())
        .then(meal => {
            document.getElementById('mealDisplay').innerHTML = meal;
        })
        .catch(error => {
            console.error('Error fetching meal:', error);
        });
}