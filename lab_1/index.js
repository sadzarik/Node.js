// task 1
const add = (x) => {
    let res = x;
    const inner = (y) => {
        if (y) {
            res += y;
            return inner;
        }
        return res
    };
    return inner;
}

console.log(add(2)(5)(7)(1)(6)(5)(11)());

// task 2
const areAnagrams = (string1, string2) => {
    return string1.split(``).sort().join(``) === string2.split(``).sort().join(``);
};

console.log(areAnagrams(`alar`, `aral`));

// task 3
const deepCopy = (obj =  {}) => {
    const newObj = {};
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object')
            newObj[key] = deepCopy(obj[key]);
        else
            newObj[key] = obj[key];
    }
    return newObj;
}

// task 4

const wrapper = (func) => {
    const cache = new Map();
    return function (...args) {
        const key = args.join();
        if (cache.has(key))
            return cache.get(key);
        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

const calc = (a, b, c) => a+b+c;
const cachedCalc = wrapper(calc);

cachedCalc(2,2,3); // 7 calculated
cachedCalc(5,8,1); // 14 calculated
cachedCalc(2,2,3); // 7 from cache
