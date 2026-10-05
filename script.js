// Клас посилки (Parcel)
class Parcel {
    #weight;
    static #count = 0;

    constructor(recipient, weight, length, width, height) {
        this.recipient = recipient;
        this.weight = weight; // Виклик сеттера
        this.length = length;
        this.width = width;
        this.height = height;

        Parcel.#count++;
    }

    get weight() {
        return this.#weight;
    }

    set weight(val) {
        if (val <= 0) {
            throw new Error("Вага має бути більшою за нуль!");
        }
        this.#weight = val;
    }

    get volumetricWeight() {
        return (this.length * this.width * this.height) / 5000;
    }

    get chargeableWeight() {
        return Math.max(this.weight, this.volumetricWeight);
    }

    describe() {
        return `Відправлення для ${this.recipient} | Вага: ${this.weight} кг (об'ємна: ${this.volumetricWeight} кг, розрахункова: ${this.chargeableWeight} кг)`;
    }

    static getCount() {
        return Parcel.#count;
    }
}

// Базовий калькулятор тарифів
class ParcelPriceCalculator {
    constructor(ratePerKg) {
        this.ratePerKg = ratePerKg;
    }

    calculate(parcel) {
        return parcel.chargeableWeight * this.ratePerKg;
    }

    getName() {
        return "Базовий тариф";
    }
}

// Нащадки калькулятора

// Поштове відділення (15 грн/кг)
class PostOfficeParcelPriceCalculator extends ParcelPriceCalculator {
    constructor() {
        super(15);
    }

    getName() {
        return "Відділення пошти";
    }
}

// Кур'єр (30 грн/кг)
class CourierParcelPriceCalculator extends ParcelPriceCalculator {
    constructor() {
        super(30);
    }

    getName() {
        return "Кур'єрська доставка";
    }
}

// Експрес (30 грн/кг + 25 грн/кг за терміновість)
class ExpressParcelPriceCalculator extends ParcelPriceCalculator {
    constructor() {
        super(30);
        this.expressRatePerKg = 25;
    }

    calculate(parcel) {
        return super.calculate(parcel) + parcel.chargeableWeight * this.expressRatePerKg;
    }

    getName() {
        return "Експрес-доставка";
    }
}

// Тестування

const p1 = new Parcel("Максим Белощук", 7, 15, 15, 10);
const p2 = new Parcel("Андрій Шевченко", 1.5, 45, 35, 25);
const p3 = new Parcel("Дмитро Бондар", 3, 25, 20, 15);

const packagesList = [p1, p2, p3];

const tariffCalculators = [
    new PostOfficeParcelPriceCalculator(),
    new CourierParcelPriceCalculator(),
    new ExpressParcelPriceCalculator()
];

console.log("=== РОЗРАХУНОК ДОСТАВКИ (ООП JS) ===");

const container = document.getElementById("results-container");

for (const pkg of packagesList) {
    console.log("\n" + pkg.describe());

    let blockHtml = `
        <div class="item-box">
            <div class="item-header">${pkg.describe()}</div>
            <ul class="tariffs-list">
    `;

    for (const calc of tariffCalculators) {
        const total = calc.calculate(pkg);
        console.log(`  * ${calc.getName()}: ${total} грн`);
        blockHtml += `<li><strong>${calc.getName()}:</strong> ${total} грн</li>`;
    }

    blockHtml += `</ul></div>`;
    if (container) container.innerHTML += blockHtml;
}

console.log("\nЗагалом створено відправлень: " + Parcel.getCount());

if (container) {
    container.innerHTML += `<div class="count-info">Всього зареєстровано посилок: ${Parcel.getCount()} шт.</div>`;
}
