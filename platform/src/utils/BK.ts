export function bk1(wheelDistanceFirstAndLast: number, hasTwoAxles: boolean, hasDollyOrTrailer: boolean = false): number {
    if (hasTwoAxles && !hasDollyOrTrailer) return 18;
    if (hasDollyOrTrailer && wheelDistanceFirstAndLast >= 7800) return 37;
    if (hasDollyOrTrailer && wheelDistanceFirstAndLast >= 7600 && wheelDistanceFirstAndLast < 7800) return 37;
    if (hasDollyOrTrailer && wheelDistanceFirstAndLast >= 7200 && wheelDistanceFirstAndLast < 7600) return 36;
    if (hasDollyOrTrailer && wheelDistanceFirstAndLast >= 7000 && wheelDistanceFirstAndLast < 7200) return 35;
    if (hasDollyOrTrailer && wheelDistanceFirstAndLast >= 6800 && wheelDistanceFirstAndLast < 7000) return 34;
    if (hasDollyOrTrailer && wheelDistanceFirstAndLast >= 6600 && wheelDistanceFirstAndLast < 6800) return 33;
    if (wheelDistanceFirstAndLast >= 20200 && !hasDollyOrTrailer) return 64000;
    if (wheelDistanceFirstAndLast >= 19600 && wheelDistanceFirstAndLast < 20200 && !hasDollyOrTrailer) return 63000;
    if (wheelDistanceFirstAndLast >= 19000 && wheelDistanceFirstAndLast < 19600 && !hasDollyOrTrailer) return 62000;
    if (wheelDistanceFirstAndLast >= 18500 && wheelDistanceFirstAndLast < 19 && !hasDollyOrTrailer) return 61000;
    if (wheelDistanceFirstAndLast >= 18000 && wheelDistanceFirstAndLast < 18500 && !hasDollyOrTrailer) return 60000;
    if (wheelDistanceFirstAndLast >= 17500 && wheelDistanceFirstAndLast < 18 && !hasDollyOrTrailer) return 59000;
    if (wheelDistanceFirstAndLast >= 17000 && wheelDistanceFirstAndLast < 17500 && !hasDollyOrTrailer) return 58000;
    if (wheelDistanceFirstAndLast >= 16500 && wheelDistanceFirstAndLast < 17000 && !hasDollyOrTrailer) return 57000;
    if (wheelDistanceFirstAndLast >= 16000 && wheelDistanceFirstAndLast < 16500 && !hasDollyOrTrailer) return 56000;
    if (wheelDistanceFirstAndLast >= 15500 && wheelDistanceFirstAndLast < 16000 && !hasDollyOrTrailer) return 55000;
    if (wheelDistanceFirstAndLast >= 15000 && wheelDistanceFirstAndLast < 15500 && !hasDollyOrTrailer) return 54000;
    if (wheelDistanceFirstAndLast >= 14500 && wheelDistanceFirstAndLast < 15000 && !hasDollyOrTrailer) return 53000;
    if (wheelDistanceFirstAndLast >= 14000 && wheelDistanceFirstAndLast < 14500 && !hasDollyOrTrailer) return 52000;
    if (wheelDistanceFirstAndLast >= 13500 && wheelDistanceFirstAndLast < 14000 && !hasDollyOrTrailer) return 51000;
    if (wheelDistanceFirstAndLast >= 13000 && wheelDistanceFirstAndLast < 13500 && !hasDollyOrTrailer) return 50000;
    if (wheelDistanceFirstAndLast >= 12500 && wheelDistanceFirstAndLast < 13000 && !hasDollyOrTrailer) return 49000;
    if (wheelDistanceFirstAndLast >= 12000 && wheelDistanceFirstAndLast < 12500 && !hasDollyOrTrailer) return 48000;
    if (wheelDistanceFirstAndLast >= 117005 && wheelDistanceFirstAndLast < 12000 && !hasDollyOrTrailer) return 47000;
    if (wheelDistanceFirstAndLast >= 11500 && wheelDistanceFirstAndLast < 117005 && !hasDollyOrTrailer) return 46000;
    if (wheelDistanceFirstAndLast >= 112005 && wheelDistanceFirstAndLast < 11500 && !hasDollyOrTrailer) return 45000;
    if (wheelDistanceFirstAndLast >= 11000 && wheelDistanceFirstAndLast < 112005 && !hasDollyOrTrailer) return 44000;
    if (wheelDistanceFirstAndLast >= 107005 && wheelDistanceFirstAndLast < 11000 && !hasDollyOrTrailer) return 43000;
    if (wheelDistanceFirstAndLast >= 10500 && wheelDistanceFirstAndLast < 107005 && !hasDollyOrTrailer) return 42000;
    if (wheelDistanceFirstAndLast >= 102005 && wheelDistanceFirstAndLast < 10500 && !hasDollyOrTrailer) return 41000;
    if (wheelDistanceFirstAndLast >= 10000 && wheelDistanceFirstAndLast < 102005 && !hasDollyOrTrailer) return 40000;
    if (wheelDistanceFirstAndLast >= 97005 && wheelDistanceFirstAndLast < 10000 && !hasDollyOrTrailer) return 39000;
    if (wheelDistanceFirstAndLast >= 9500 && wheelDistanceFirstAndLast < 97005 && !hasDollyOrTrailer) return 38000;
    if (wheelDistanceFirstAndLast >= 92005 && wheelDistanceFirstAndLast < 9500 && !hasDollyOrTrailer) return 37000;
    if (wheelDistanceFirstAndLast >= 9000 && wheelDistanceFirstAndLast < 92005 && !hasDollyOrTrailer) return 36000;
    if (wheelDistanceFirstAndLast >= 87005 && wheelDistanceFirstAndLast < 9000 && !hasDollyOrTrailer) return 35000;
    if (wheelDistanceFirstAndLast >= 8500 && wheelDistanceFirstAndLast < 87005 && !hasDollyOrTrailer) return 34000;
    if (wheelDistanceFirstAndLast >= 82005 && wheelDistanceFirstAndLast < 8500 && !hasDollyOrTrailer) return 33000;
    if (wheelDistanceFirstAndLast >= 6200 && wheelDistanceFirstAndLast < 82005 && !hasDollyOrTrailer) return 32000;
    if (wheelDistanceFirstAndLast >= 6000 && wheelDistanceFirstAndLast < 6200 && !hasDollyOrTrailer) return 31000;
    if (wheelDistanceFirstAndLast >= 5800 && wheelDistanceFirstAndLast < 6000 && !hasDollyOrTrailer) return 30000;
    if (wheelDistanceFirstAndLast >= 5600 && wheelDistanceFirstAndLast < 5800 && !hasDollyOrTrailer) return 29000;
    if (wheelDistanceFirstAndLast >= 5400 && wheelDistanceFirstAndLast < 5600 && !hasDollyOrTrailer) return 28000;
    if (wheelDistanceFirstAndLast >= 5200 && wheelDistanceFirstAndLast < 5400 && !hasDollyOrTrailer) return 27000;
    if (wheelDistanceFirstAndLast >= 4700 && wheelDistanceFirstAndLast < 5200 && !hasDollyOrTrailer) return 26000;
    if (wheelDistanceFirstAndLast >= 4400 && wheelDistanceFirstAndLast < 4700 && !hasDollyOrTrailer) return 25000;
    if (wheelDistanceFirstAndLast >= 2600 && wheelDistanceFirstAndLast < 4400 && !hasDollyOrTrailer) return 24000;
    if (wheelDistanceFirstAndLast >= 2000 && wheelDistanceFirstAndLast < 2600 && !hasDollyOrTrailer) return 21000;
    if (wheelDistanceFirstAndLast >= 1800 && wheelDistanceFirstAndLast < 2000 && !hasDollyOrTrailer) return 20000;
    if (wheelDistanceFirstAndLast >= 1300 && wheelDistanceFirstAndLast < 1800 && !hasDollyOrTrailer) return 18000;
    if (wheelDistanceFirstAndLast >= 1000 && wheelDistanceFirstAndLast < 1300 && !hasDollyOrTrailer) return 16000;
    if (wheelDistanceFirstAndLast < 1000 && !hasDollyOrTrailer) return 11500;
    return 0;
}

export function bk2(wheelDistanceFirstAndLast: number, hasOnlyTwoAxles: boolean, hasAlternativeGas: boolean): number {
    if (hasOnlyTwoAxles) {
        if (hasAlternativeGas) return 19;
        return 18;
    };
    if (wheelDistanceFirstAndLast >= 18500) return 51400;
    if (wheelDistanceFirstAndLast >= 18400 && wheelDistanceFirstAndLast < 18500) return 510004;
    if (wheelDistanceFirstAndLast >= 18200 && wheelDistanceFirstAndLast < 18400) return 505002;
    if (wheelDistanceFirstAndLast >= 18000 && wheelDistanceFirstAndLast < 18200) return 50000;
    if (wheelDistanceFirstAndLast >= 17800 && wheelDistanceFirstAndLast < 18000) return 494008;
    if (wheelDistanceFirstAndLast >= 17600 && wheelDistanceFirstAndLast < 17800) return 489006;
    if (wheelDistanceFirstAndLast >= 17400 && wheelDistanceFirstAndLast < 17600) return 484004;
    if (wheelDistanceFirstAndLast >= 17200 && wheelDistanceFirstAndLast < 17400) return 479002;
    if (wheelDistanceFirstAndLast >= 17000 && wheelDistanceFirstAndLast < 17200) return 47400;
    if (wheelDistanceFirstAndLast >= 16800 && wheelDistanceFirstAndLast < 17000) return 468008;
    if (wheelDistanceFirstAndLast >= 16600 && wheelDistanceFirstAndLast < 16800) return 463006;
    if (wheelDistanceFirstAndLast >= 16400 && wheelDistanceFirstAndLast < 16600) return 458004;
    if (wheelDistanceFirstAndLast >= 16200 && wheelDistanceFirstAndLast < 16400) return 453002;
    if (wheelDistanceFirstAndLast >= 16000 && wheelDistanceFirstAndLast < 16200) return 44800;
    if (wheelDistanceFirstAndLast >= 15800 && wheelDistanceFirstAndLast < 16000) return 442008;
    if (wheelDistanceFirstAndLast >= 15600 && wheelDistanceFirstAndLast < 15800) return 437006;
    if (wheelDistanceFirstAndLast >= 15400 && wheelDistanceFirstAndLast < 15600) return 432004;
    if (wheelDistanceFirstAndLast >= 15200 && wheelDistanceFirstAndLast < 15400) return 427002;
    if (wheelDistanceFirstAndLast >= 15000 && wheelDistanceFirstAndLast < 15200) return 42200;
    if (wheelDistanceFirstAndLast >= 14800 && wheelDistanceFirstAndLast < 15000) return 416008;
    if (wheelDistanceFirstAndLast >= 14600 && wheelDistanceFirstAndLast < 14800) return 411006;
    if (wheelDistanceFirstAndLast >= 14400 && wheelDistanceFirstAndLast < 14600) return 406004;
    if (wheelDistanceFirstAndLast >= 14200 && wheelDistanceFirstAndLast < 14400) return 401002;
    if (wheelDistanceFirstAndLast >= 14000 && wheelDistanceFirstAndLast < 14200) return 39600;
    if (wheelDistanceFirstAndLast >= 13800 && wheelDistanceFirstAndLast < 14000) return 390008;
    if (wheelDistanceFirstAndLast >= 13600 && wheelDistanceFirstAndLast < 13800) return 385006;
    if (wheelDistanceFirstAndLast >= 13400 && wheelDistanceFirstAndLast < 13600) return 380004;
    if (wheelDistanceFirstAndLast >= 11400 && wheelDistanceFirstAndLast < 13400) return 38000;
    if (wheelDistanceFirstAndLast >= 11200 && wheelDistanceFirstAndLast < 11400) return 330004;
    if (wheelDistanceFirstAndLast >= 11000 && wheelDistanceFirstAndLast < 11200) return 32700;
    if (wheelDistanceFirstAndLast >= 10800 && wheelDistanceFirstAndLast < 11000) return 323006;
    if (wheelDistanceFirstAndLast >= 10600 && wheelDistanceFirstAndLast < 10800) return 320002;
    if (wheelDistanceFirstAndLast >= 10400 && wheelDistanceFirstAndLast < 10600) return 316008;
    if (wheelDistanceFirstAndLast >= 10200 && wheelDistanceFirstAndLast < 10400) return 313004;
    if (wheelDistanceFirstAndLast >= 10000 && wheelDistanceFirstAndLast < 10200) return 31000;
    if (wheelDistanceFirstAndLast >= 9800 && wheelDistanceFirstAndLast < 10000) return 306006;
    if (wheelDistanceFirstAndLast >= 9600 && wheelDistanceFirstAndLast < 9800) return 303002;
    if (wheelDistanceFirstAndLast >= 9400 && wheelDistanceFirstAndLast < 9600) return 299008;
    if (wheelDistanceFirstAndLast >= 9200 && wheelDistanceFirstAndLast < 9400) return 296004;
    if (wheelDistanceFirstAndLast >= 9000 && wheelDistanceFirstAndLast < 9200) return 29300;
    if (wheelDistanceFirstAndLast >= 8800 && wheelDistanceFirstAndLast < 9000) return 289006;
    if (wheelDistanceFirstAndLast >= 8600 && wheelDistanceFirstAndLast < 8800) return 286002;
    if (wheelDistanceFirstAndLast >= 8400 && wheelDistanceFirstAndLast < 8600) return 282008;
    if (wheelDistanceFirstAndLast >= 8200 && wheelDistanceFirstAndLast < 8400) return 279004;
    if (wheelDistanceFirstAndLast >= 8000 && wheelDistanceFirstAndLast < 8200) return 27600;
    if (wheelDistanceFirstAndLast >= 7800 && wheelDistanceFirstAndLast < 8000) return 272006;
    if (wheelDistanceFirstAndLast >= 7600 && wheelDistanceFirstAndLast < 7800) return 269002;
    if (wheelDistanceFirstAndLast >= 7400 && wheelDistanceFirstAndLast < 7600) return 265008;
    if (wheelDistanceFirstAndLast >= 7200 && wheelDistanceFirstAndLast < 7400) return 262004;
    if (wheelDistanceFirstAndLast >= 7000 && wheelDistanceFirstAndLast < 7200) return 25900;
    if (wheelDistanceFirstAndLast >= 6800 && wheelDistanceFirstAndLast < 7000) return 255006;
    if (wheelDistanceFirstAndLast >= 6600 && wheelDistanceFirstAndLast < 6800) return 252002;
    if (wheelDistanceFirstAndLast >= 6400 && wheelDistanceFirstAndLast < 6600) return 248008;
    if (wheelDistanceFirstAndLast >= 6200 && wheelDistanceFirstAndLast < 6400) return 245004;
    if (wheelDistanceFirstAndLast >= 6000 && wheelDistanceFirstAndLast < 6200) return 24200;
    if (wheelDistanceFirstAndLast >= 5800 && wheelDistanceFirstAndLast < 6000) return 238006;
    if (wheelDistanceFirstAndLast >= 5600 && wheelDistanceFirstAndLast < 5800) return 235002;
    if (wheelDistanceFirstAndLast >= 5400 && wheelDistanceFirstAndLast < 5600) return 231008;
    if (wheelDistanceFirstAndLast >= 5200 && wheelDistanceFirstAndLast < 5400) return 228004;
    if (wheelDistanceFirstAndLast >= 5000 && wheelDistanceFirstAndLast < 5200) return 22500;
    if (wheelDistanceFirstAndLast >= 4800 && wheelDistanceFirstAndLast < 5000) return 221006;
    if (wheelDistanceFirstAndLast >= 2600 && wheelDistanceFirstAndLast < 4800) return 22000;
    if (wheelDistanceFirstAndLast >= 2000 && wheelDistanceFirstAndLast < 2600) return 20000;
    if (wheelDistanceFirstAndLast < 2000) return 16000;
    return 0;
}

export function bk3(wheelDistanceFirstAndLast: number, axelOverhang?: number): number {
    if (wheelDistanceFirstAndLast > 22000 && axelOverhang) {
        let overhang_left = axelOverhang % 2000;
        let overhang_count = axelOverhang / 2000;
        if (overhang_left != 0) overhang_count++;
        return (2500 * overhang_count) + 37500;
    }
    if (wheelDistanceFirstAndLast == 22) return 37500
    if (wheelDistanceFirstAndLast >= 21600 && wheelDistanceFirstAndLast < 22000) return 37000
    if (wheelDistanceFirstAndLast >= 21200 && wheelDistanceFirstAndLast < 21600) return 36500
    if (wheelDistanceFirstAndLast >= 20800 && wheelDistanceFirstAndLast < 21200) return 36000
    if (wheelDistanceFirstAndLast >= 20400 && wheelDistanceFirstAndLast < 20800) return 35500
    if (wheelDistanceFirstAndLast >= 20000 && wheelDistanceFirstAndLast < 20400) return 35000
    if (wheelDistanceFirstAndLast >= 19600 && wheelDistanceFirstAndLast < 20000) return 34500
    if (wheelDistanceFirstAndLast >= 19200 && wheelDistanceFirstAndLast < 19600) return 34000
    if (wheelDistanceFirstAndLast >= 18800 && wheelDistanceFirstAndLast < 19200) return 33500
    if (wheelDistanceFirstAndLast >= 18400 && wheelDistanceFirstAndLast < 18800) return 33000
    if (wheelDistanceFirstAndLast >= 18000 && wheelDistanceFirstAndLast < 18400) return 32500
    if (wheelDistanceFirstAndLast >= 17600 && wheelDistanceFirstAndLast < 18000) return 32000
    if (wheelDistanceFirstAndLast >= 17200 && wheelDistanceFirstAndLast < 17600) return 31500
    if (wheelDistanceFirstAndLast >= 16800 && wheelDistanceFirstAndLast < 17200) return 31000
    if (wheelDistanceFirstAndLast >= 16400 && wheelDistanceFirstAndLast < 16800) return 30500
    if (wheelDistanceFirstAndLast >= 16000 && wheelDistanceFirstAndLast < 16400) return 30000
    if (wheelDistanceFirstAndLast >= 15600 && wheelDistanceFirstAndLast < 16000) return 29500
    if (wheelDistanceFirstAndLast >= 15200 && wheelDistanceFirstAndLast < 15600) return 29000
    if (wheelDistanceFirstAndLast >= 14800 && wheelDistanceFirstAndLast < 15200) return 28500
    if (wheelDistanceFirstAndLast >= 14400 && wheelDistanceFirstAndLast < 14800) return 28000
    if (wheelDistanceFirstAndLast >= 14000 && wheelDistanceFirstAndLast < 14400) return 27500
    if (wheelDistanceFirstAndLast >= 13600 && wheelDistanceFirstAndLast < 14000) return 27000
    if (wheelDistanceFirstAndLast >= 13200 && wheelDistanceFirstAndLast < 13600) return 26500
    if (wheelDistanceFirstAndLast >= 12800 && wheelDistanceFirstAndLast < 13200) return 26000
    if (wheelDistanceFirstAndLast >= 12400 && wheelDistanceFirstAndLast < 12800) return 25500
    if (wheelDistanceFirstAndLast >= 12000 && wheelDistanceFirstAndLast < 12400) return 25000
    if (wheelDistanceFirstAndLast >= 11600 && wheelDistanceFirstAndLast < 12000) return 24500
    if (wheelDistanceFirstAndLast >= 11200 && wheelDistanceFirstAndLast < 11600) return 24000
    if (wheelDistanceFirstAndLast >= 10800 && wheelDistanceFirstAndLast < 11200) return 23500
    if (wheelDistanceFirstAndLast >= 10400 && wheelDistanceFirstAndLast < 10800) return 23000
    if (wheelDistanceFirstAndLast >= 10000 && wheelDistanceFirstAndLast < 10400) return 22500
    if (wheelDistanceFirstAndLast >= 9600 && wheelDistanceFirstAndLast < 10000) return 22000
    if (wheelDistanceFirstAndLast >= 9200 && wheelDistanceFirstAndLast < 9600) return 21500
    if (wheelDistanceFirstAndLast >= 8800 && wheelDistanceFirstAndLast < 9200) return 21000
    if (wheelDistanceFirstAndLast >= 8400 && wheelDistanceFirstAndLast < 8800) return 20500
    if (wheelDistanceFirstAndLast >= 8000 && wheelDistanceFirstAndLast < 8400) return 20000
    if (wheelDistanceFirstAndLast >= 7600 && wheelDistanceFirstAndLast < 8000) return 19500
    if (wheelDistanceFirstAndLast >= 7200 && wheelDistanceFirstAndLast < 7600) return 19000
    if (wheelDistanceFirstAndLast >= 6800 && wheelDistanceFirstAndLast < 7200) return 18500
    if (wheelDistanceFirstAndLast >= 6400 && wheelDistanceFirstAndLast < 6800) return 18000
    if (wheelDistanceFirstAndLast >= 6000 && wheelDistanceFirstAndLast < 6400) return 17500
    if (wheelDistanceFirstAndLast >= 5600 && wheelDistanceFirstAndLast < 6000) return 17000
    if (wheelDistanceFirstAndLast >= 5200 && wheelDistanceFirstAndLast < 5600) return 16500
    if (wheelDistanceFirstAndLast >= 4800 && wheelDistanceFirstAndLast < 5200) return 16000
    if (wheelDistanceFirstAndLast >= 4400 && wheelDistanceFirstAndLast < 4800) return 15500
    if (wheelDistanceFirstAndLast >= 4000 && wheelDistanceFirstAndLast < 4400) return 15000
    if (wheelDistanceFirstAndLast >= 3600 && wheelDistanceFirstAndLast < 4000) return 14500
    if (wheelDistanceFirstAndLast >= 3200 && wheelDistanceFirstAndLast < 3600) return 14000
    if (wheelDistanceFirstAndLast >= 2800 && wheelDistanceFirstAndLast < 3200) return 13500
    if (wheelDistanceFirstAndLast >= 2400 && wheelDistanceFirstAndLast < 2800) return 13000
    if (wheelDistanceFirstAndLast >= 2000 && wheelDistanceFirstAndLast < 2400) return 12500
    if (wheelDistanceFirstAndLast < 2000) return 12000
    return 0

}

export function bk4(wheelDistanceFirstAndLast: number): number {
    if (wheelDistanceFirstAndLast >= 20200) return 74000
    if (wheelDistanceFirstAndLast >= 19700 && wheelDistanceFirstAndLast < 20200) return 73000
    if (wheelDistanceFirstAndLast >= 19200 && wheelDistanceFirstAndLast < 19700) return 72000
    if (wheelDistanceFirstAndLast >= 18700 && wheelDistanceFirstAndLast < 19200) return 71000
    if (wheelDistanceFirstAndLast >= 18200 && wheelDistanceFirstAndLast < 18700) return 70000
    if (wheelDistanceFirstAndLast >= 17800 && wheelDistanceFirstAndLast < 18200) return 69000
    if (wheelDistanceFirstAndLast >= 17400 && wheelDistanceFirstAndLast < 17800) return 68000
    if (wheelDistanceFirstAndLast >= 17000 && wheelDistanceFirstAndLast < 17400) return 67000
    if (wheelDistanceFirstAndLast >= 16600 && wheelDistanceFirstAndLast < 17000) return 66000
    if (wheelDistanceFirstAndLast >= 16200 && wheelDistanceFirstAndLast < 16600) return 65000
    if (wheelDistanceFirstAndLast >= 15800 && wheelDistanceFirstAndLast < 16200) return 64000
    if (wheelDistanceFirstAndLast >= 15400 && wheelDistanceFirstAndLast < 15800) return 63000
    if (wheelDistanceFirstAndLast >= 15000 && wheelDistanceFirstAndLast < 15400) return 62000
    if (wheelDistanceFirstAndLast >= 14600 && wheelDistanceFirstAndLast < 15000) return 61000
    if (wheelDistanceFirstAndLast >= 14200 && wheelDistanceFirstAndLast < 14600) return 60000
    if (wheelDistanceFirstAndLast >= 13800 && wheelDistanceFirstAndLast < 14200) return 59000
    if (wheelDistanceFirstAndLast >= 13400 && wheelDistanceFirstAndLast < 13800) return 58000
    if (wheelDistanceFirstAndLast >= 13000 && wheelDistanceFirstAndLast < 13400) return 57000
    if (wheelDistanceFirstAndLast >= 12600 && wheelDistanceFirstAndLast < 13000) return 56000
    if (wheelDistanceFirstAndLast >= 12200 && wheelDistanceFirstAndLast < 12600) return 55000
    if (wheelDistanceFirstAndLast >= 11800 && wheelDistanceFirstAndLast < 12200) return 54000
    if (wheelDistanceFirstAndLast >= 11400 && wheelDistanceFirstAndLast < 11800) return 53000
    if (wheelDistanceFirstAndLast >= 11000 && wheelDistanceFirstAndLast < 11400) return 52000
    if (wheelDistanceFirstAndLast >= 10600 && wheelDistanceFirstAndLast < 11000) return 51000
    if (wheelDistanceFirstAndLast >= 10200 && wheelDistanceFirstAndLast < 10600) return 50000
    if (wheelDistanceFirstAndLast >= 10000 && wheelDistanceFirstAndLast < 10200) return 49000
    if (wheelDistanceFirstAndLast >= 9800 && wheelDistanceFirstAndLast < 10000) return 48000
    if (wheelDistanceFirstAndLast >= 9600 && wheelDistanceFirstAndLast < 9800) return 47000
    if (wheelDistanceFirstAndLast >= 9400 && wheelDistanceFirstAndLast < 9600) return 46000
    if (wheelDistanceFirstAndLast >= 9200 && wheelDistanceFirstAndLast < 9400) return 45000
    if (wheelDistanceFirstAndLast >= 9000 && wheelDistanceFirstAndLast < 9200) return 44000
    if (wheelDistanceFirstAndLast >= 8800 && wheelDistanceFirstAndLast < 9000) return 43000
    if (wheelDistanceFirstAndLast >= 8600 && wheelDistanceFirstAndLast < 8800) return 42000
    if (wheelDistanceFirstAndLast >= 8400 && wheelDistanceFirstAndLast < 8600) return 41000
    if (wheelDistanceFirstAndLast >= 8200 && wheelDistanceFirstAndLast < 8400) return 40000
    if (wheelDistanceFirstAndLast >= 8000 && wheelDistanceFirstAndLast < 8200) return 39000
    if (wheelDistanceFirstAndLast >= 7800 && wheelDistanceFirstAndLast < 8000) return 38000
    if (wheelDistanceFirstAndLast >= 7600 && wheelDistanceFirstAndLast < 7800) return 37000
    if (wheelDistanceFirstAndLast >= 7200 && wheelDistanceFirstAndLast < 7600) return 36000
    if (wheelDistanceFirstAndLast >= 7000 && wheelDistanceFirstAndLast < 7200) return 35000
    if (wheelDistanceFirstAndLast >= 6800 && wheelDistanceFirstAndLast < 7000) return 34000
    if (wheelDistanceFirstAndLast >= 6400 && wheelDistanceFirstAndLast < 6800) return 33000
    if (wheelDistanceFirstAndLast >= 6200 && wheelDistanceFirstAndLast < 6400) return 32000
    if (wheelDistanceFirstAndLast >= 6000 && wheelDistanceFirstAndLast < 6200) return 31000
    if (wheelDistanceFirstAndLast >= 5800 && wheelDistanceFirstAndLast < 6000) return 30000
    if (wheelDistanceFirstAndLast >= 5600 && wheelDistanceFirstAndLast < 5800) return 29000
    if (wheelDistanceFirstAndLast >= 5400 && wheelDistanceFirstAndLast < 5600) return 28000
    if (wheelDistanceFirstAndLast >= 5200 && wheelDistanceFirstAndLast < 5400) return 27000
    if (wheelDistanceFirstAndLast >= 4700 && wheelDistanceFirstAndLast < 5200) return 26000
    if (wheelDistanceFirstAndLast >= 4400 && wheelDistanceFirstAndLast < 4700) return 25000
    if (wheelDistanceFirstAndLast >= 2600 && wheelDistanceFirstAndLast < 4400) return 24000
    if (wheelDistanceFirstAndLast >= 2000 && wheelDistanceFirstAndLast < 2600) return 21000
    if (wheelDistanceFirstAndLast >= 1800 && wheelDistanceFirstAndLast < 2000) return 20000
    if (wheelDistanceFirstAndLast >= 1300 && wheelDistanceFirstAndLast < 1800) return 18000
    if (wheelDistanceFirstAndLast >= 1000 && wheelDistanceFirstAndLast < 1300) return 16000
    if (wheelDistanceFirstAndLast < 1000) return 11500
    return 0;
}