class Int {
    constructor(number) {
        this.string = "" + number;
        this.number = number;
    }

    column(index) {
        return this.string[(this.string.length - 1) - index];
    }

    get length() {
        return this.string.length;
    }

    get sum() {
        const carry = this.string.slice(0, -1);
        const place = this.string.slice(-1);
        return {
            carry: carry ? parseInt(carry) : null,
            place: place ? parseInt(place) : null
        }
    }
}

const DEBUG_MODE = true;
const log = DEBUG_MODE ? console.log : () => { };

const app = document.querySelector("#app");
const numbers = [425, 76];
const ints = numbers.map(number => new Int(number)).toSorted((a, b) => b.length - a.length);
const max = ints[0].length;

const carrySums = [null];
const placeSums = [];

let carry

for (let i = 0; i < max; i++) {
    log("column", i)
    let sum = ints.reduce((acc, cur) => {
        const column = cur.column(i);
        log("\taddend", column)
        return acc + (column ? parseInt(column) : 0);
    }, 0);
    if (carry) {
        log("\tcarry", carry)
        sum += carry;
        carry = undefined;
    }
    log("\tsum:", sum)
    const int = new Int(sum);
    carry = parseInt(int.sum.carry);

    placeSums.unshift(int.sum.place);
    carrySums.unshift(int.sum.carry);
}

console.log({
    carrySums,
    placeSums
})

app.innerHTML = `
    <div id="carry-sums">
        ${carrySums.reduce((html, sum) => html + (sum != undefined ? `<input pattern="^${sum}$" />` : "<span></span>"), "")}
    </div>
    <div id="addends">
        ${ints.reduce((html, int) => html + "<div class='addend'>" + int.string.split("").reduce((str, char) => str + `<span>${char}</span>`, "") + "</div>", "")}
    </div>
    <div id="place-sums">
        ${placeSums.reduce((html, sum) => html + (sum != undefined ? `<input pattern="^${sum}$" />` : "<span></span>"), "")}
    </div>
`