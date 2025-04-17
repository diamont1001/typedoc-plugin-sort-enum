export var Test;
(function (Test) {
    Test[Test["Five"] = 5] = "Five";
    Test[Test["Six"] = 6] = "Six";
    Test[Test["Zero"] = 0] = "Zero";
    Test[Test["Two"] = 2] = "Two";
    Test["Word"] = "hello";
})(Test || (Test = {}));
