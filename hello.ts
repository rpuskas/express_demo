interface Person {
    first: string;
    last: string;
}

var repeatYourselfAgain = function(x: Person) {
    return x.first + x.last + x.age;
}

var me = {first: "ryan", last: "puskas", age: 37};

console.log(repeatYourselfAgain(me));


