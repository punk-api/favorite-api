const recommend =  require('collaborative-filter');
import flatten = require("lodash.flatten");

export function calculate(groups: {[groupName: string]: string[]}, forUser: string) {
    const users = Object.keys(groups);
    const allItems = flatten(Object.values(groups));
    const items = allItems.filter((item, index, all) => all.indexOf(item) === index);
    const ratings = users.map(user => items.map(item => groups[user].includes(item) ? 1 : 0))
    const results: number[] = recommend.CFilter(ratings, users.indexOf(forUser));
    return results.map(result => items[result]);
}