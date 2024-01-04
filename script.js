class Int {
    constructor(number) {
        this.string = "" + number;
        this.number = number;
    }

    column(index) {
        return this.string[this.string.length - 1 - index];
    }

    get length() {
        return this.string.length;
    }

    get sum() {
        const carry = this.string.slice(0, -1);
        const place = this.string.slice(-1);
        return {
            carry: carry ? parseInt(carry) : null,
            place: place ? parseInt(place) : null,
        };
    }
}

window.DEBUG_MODE = ["localhost", "127.0.0.1"].includes(location.hostname);
const log = window.DEBUG_MODE ? console.log : () => { };

const app = document.querySelector("#app");
const form = document.querySelector("form#settings");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.matches(":has(:invalid)")) {
        return alert("All fields are required!");
    }
    const formData = new FormData(form);
    const addendsCount = formData.get("addendsCount");
    const maxDigits = formData.get("maxDigits");

    log({
        addendsCount,
        maxDigits,
    });

    const addends = generateAddends(addendsCount, maxDigits);

    generateProblem(addends);
});

function generateAddends(count, maxDigits) {
    const addends = [];
    for (let i = 0; i < count; i++) {
        addends.push(Math.floor(Math.random() * 10 ** maxDigits));
    }
    return addends.toSorted((a, b) => b - a);
}

function generateProblem(addends) {
    const ints = addends
        .map((number) => new Int(number))
        .toSorted((a, b) => b.length - a.length);
    const max = ints[0].length;

    const carrySums = [null];
    const placeSums = [];

    let carry;

    for (let i = 0; i < max; i++) {
        log("column", i);
        let sum = ints.reduce((acc, cur) => {
            const column = cur.column(i);
            log("\taddend", column);
            return acc + (column ? parseInt(column) : 0);
        }, 0);
        if (carry) {
            log("\tcarry", carry);
            sum += carry;
            carry = undefined;
        }
        log("\tsum:", sum);
        const int = new Int(sum);
        carry = int.sum.carry;

        placeSums.unshift(int.sum.place);
        carrySums.unshift(int.sum.carry);
    }

    if (carry) {
        // For a hanging carry, remove first carry sum and add it to place sums
        placeSums.unshift(carrySums.shift());
        carry = undefined;
    }

    log({
        carrySums,
        placeSums,
    });

    function getInputMarkup(sum) {
        const conditionalAttributes = sum != undefined
            ? `pattern="^${sum}$" required`
            // 0 or empty string
            : `pattern="^0?$"`;
        return `<input inputmode="numeric" max="9" min="0" type="text" ${conditionalAttributes} />`;
    }

    app.innerHTML = `
    <div id="carry-sums">
        ${carrySums.reduce((html, sum) => html + getInputMarkup(sum), "")}
    </div>
    <div id="addends">
        ${ints.reduce(
        (html, int) =>
            html +
            "<div class='addend'>" +
            int.string
                .split("")
                .reduce((str, char) => str + `<span>${char}</span>`, "") +
            "</div>",
        ""
    )}
    </div>
    <div id="place-sums">
        ${placeSums.reduce((html, sum) => html + getInputMarkup(sum), "")}
    </div>
`;
}

generateProblem(
    generateAddends(2, 2)
);
