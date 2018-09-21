(function() {
    'use strict';

    angular.module('utils', ['ngDialog']);

    angular.module('utils')
        .service('utils',
            function() {

                var p_validPhone = "86,88,89,90,91,92,93,94,96,97,98,99,120,121,122,123,124,125,126,127,128,129,161,162,163,164,165,166,167,168,169,186,188,199,868";
                var p_validHomePhone = "4,8,55,56,57,58,59,60,61,62,63,64,66,67,68,70,72,73,75,203,204,205,206,207,208,209,212,213,214,215,216,220,221,222,225,226,227,228,229,232,233,234,235,236,237,238,239,251,252,254,255,256,257,258,259,260,261,262,263,269,270,271,272,273,274,275,276,277,290,291,292,293,294,296,297,299,500,501,650,651,241,242,243,244,245,246,247,248,249,281,282,283,284,285,286,287,288,289";


                function IsNullOrEmpty(c) {
                    return !c || !/[^\s]+/.test(c)
                };
                // w = chuỗi mô tả số điện thoại cần kiểm tra
                // l = số điện thoại cần kiểm tra
                function validatePhoneNumber(m = false, w, l, q, y, j) {
                    q = p_validPhone;
                    y = p_validHomePhone;

                    // console.log(l);
                    // console.log(j);

                    return new Promise(function(resolve, reject){
                        if(l.length == 0){
                            reject(w + ' bắt buộc');
                        }
                        var p, d, v, k, g;
                        if (m && IsNullOrEmpty(l)) {
                            reject(w + ' bắt buộc');
                        }
                        if (!IsNullOrEmpty(l)) {
                            // if (l.indexOf("1800") === 0 || l.indexOf("1900") === 0) {
                            //     reject('Đây là đầu số 1800, 1900');
                            // }
                            // if (l[0] == "0" && (l = l.substr(1, l.length)), p = q.split(","), d = 0, p != null && p != undefined && p.length > 0) {
                            //     for (g = 0; g < p.length; g++) {
                            //         if (l.indexOf(p[g]) === 0) {
                            //             d = p[g];
                            //             break
                            //         }
                            //     }
                            //     if (g < p.length && !isNaN(l)) {
                            //         var result = d == "868" && l.length != 9 ? "Số điện thoại phải là 10 số" : d != "868" && d.length == 2 && l.length != 9 ? "Số điện thoại phải là 10 số" : d != "868" 
                            //         && d.length == 3 && l.length != 10 ? "Số điện thoại phải là 11 số" : ''

                            //         if(result !== ''){
                            //             reject(result);
                            //         }
                            //         else{
                            //             resolve('Số điện thoại hợp lệ');
                            //         }
                            //     }
                            //     if (j) {
                            //         reject("Số điện thoại di động không hợp lệ");
                            //     }
                            // }
                            // if (v = y.split(","), k = 0, v != null && v != undefined && v.length > 0) {
                            //     for (g = 0; g < v.length; g++) {
                            //         if (l.indexOf(v[g]) === 0) {
                            //             k = v[g];
                            //             break
                            //         }
                            //     }
                            //     if (g < v.length && !isNaN(l)) {
                            //         if ((k == "4" || k == "8") && l.length != 9) {
                            //             reject("Số điện thoại bàn phải là 10 số");
                            //         }
                            //         if (k != "4" && k != "8" && l.length - k.length != 7) {
                            //             reject("Số điện thoại bàn phải là " + (k.length + 8) + " số");
                            //         }
                            //     } else {
                            //         reject("Số điện thoại không hợp lệ");
                            //     }
                            // }
                            resolve('Số điện thoại hợp lệ');
                        }
                        resolve('Số điện thoại hợp lệ');
                    })
                };

                return {
                    validatePhoneNumber: validatePhoneNumber,
                    IsNullOrEmpty: IsNullOrEmpty
                }

            });
}());