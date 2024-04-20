document.addEventListener('DOMContentLoaded', function () {
    const instructionsTextarea = document.getElementById('instructions');

    instructionsTextarea.value = '1. ';

    instructionsTextarea.addEventListener('keydown', function (event) {
        const text = this.value;
        const lines = text.split('\n');

        // Check if the Enter key was pressed
        if (event.key === 'Enter') {
            event.preventDefault();

            const caretPosition = this.selectionStart;
            const lineNumber = text.substr(0, caretPosition).split('\n').length;
            const newText = text.substring(0, caretPosition) + `\n${lineNumber + 1}.  ` + text.substring(caretPosition);
            this.value = newText;

            this.setSelectionRange(caretPosition + 4, caretPosition + 4);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const instructionsTextarea = document.getElementById('ingredients');

    instructionsTextarea.value = '- ';

    instructionsTextarea.addEventListener('keydown', function (event) {
        const text = this.value;

        if (event.key === 'Enter') {
            event.preventDefault();

            const caretPosition = this.selectionStart;

            const newText = text.substring(0, caretPosition) + '\n-  ' + text.substring(caretPosition);
            this.value = newText;

            this.setSelectionRange(caretPosition + 3, caretPosition + 3);
        }
    });
});
