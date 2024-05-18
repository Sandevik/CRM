export function bk(axleDistance: number, bkNum: 1|2|3|4, hasDollyOrTrailer: boolean = false): number {
    switch (bkNum) {
        case 1:
            if (axleDistance >= 20200 && !hasDollyOrTrailer) return 64000;
            if (axleDistance >= 19600 && axleDistance < 20200 && !hasDollyOrTrailer) return 63000;
            if (axleDistance >= 19000 && axleDistance < 19600 && !hasDollyOrTrailer) return 62000;
            if (axleDistance >= 18500 && axleDistance < 19 && !hasDollyOrTrailer) return 61000;
            if (axleDistance >= 18000 && axleDistance < 18500 && !hasDollyOrTrailer) return 60000;
            if (axleDistance >= 17500 && axleDistance < 18 && !hasDollyOrTrailer) return 59000;
            if (axleDistance >= 17000 && axleDistance < 17500 && !hasDollyOrTrailer) return 58000;
            if (axleDistance >= 16500 && axleDistance < 17000 && !hasDollyOrTrailer) return 57000;
            if (axleDistance >= 16000 && axleDistance < 16500 && !hasDollyOrTrailer) return 56000;
            if (axleDistance >= 15500 && axleDistance < 16000 && !hasDollyOrTrailer) return 55000;
            if (axleDistance >= 15000 && axleDistance < 15500 && !hasDollyOrTrailer) return 54000;
            if (axleDistance >= 14500 && axleDistance < 15000 && !hasDollyOrTrailer) return 53000;
            if (axleDistance >= 14000 && axleDistance < 14500 && !hasDollyOrTrailer) return 52000;
            if (axleDistance >= 13500 && axleDistance < 14000 && !hasDollyOrTrailer) return 51000;
            if (axleDistance >= 13000 && axleDistance < 13500 && !hasDollyOrTrailer) return 50000;
            if (axleDistance >= 12500 && axleDistance < 13000 && !hasDollyOrTrailer) return 49000;
            if (axleDistance >= 12000 && axleDistance < 12500 && !hasDollyOrTrailer) return 48000;
            if (axleDistance >= 117005 && axleDistance < 12000 && !hasDollyOrTrailer) return 47000;
            if (axleDistance >= 11500 && axleDistance < 117005 && !hasDollyOrTrailer) return 46000;
            if (axleDistance >= 112005 && axleDistance < 11500 && !hasDollyOrTrailer) return 45000;
            if (axleDistance >= 11000 && axleDistance < 112005 && !hasDollyOrTrailer) return 44000;
            if (axleDistance >= 107005 && axleDistance < 11000 && !hasDollyOrTrailer) return 43000;
            if (axleDistance >= 10500 && axleDistance < 107005 && !hasDollyOrTrailer) return 42000;
            if (axleDistance >= 102005 && axleDistance < 10500 && !hasDollyOrTrailer) return 41000;
            if (axleDistance >= 10000 && axleDistance < 102005 && !hasDollyOrTrailer) return 40000;
            if (axleDistance >= 97005 && axleDistance < 10000 && !hasDollyOrTrailer) return 39000;
            if (axleDistance >= 9500 && axleDistance < 97005 && !hasDollyOrTrailer) return 38000;
            if (axleDistance >= 92005 && axleDistance < 9500 && !hasDollyOrTrailer) return 37000;
            if (axleDistance >= 9000 && axleDistance < 92005 && !hasDollyOrTrailer) return 36000;
            if (axleDistance >= 87005 && axleDistance < 9000 && !hasDollyOrTrailer) return 35000;
            if (axleDistance >= 8500 && axleDistance < 87005 && !hasDollyOrTrailer) return 34000;
            if (axleDistance >= 82005 && axleDistance < 8500 && !hasDollyOrTrailer) return 33000;
            if (axleDistance >= 6200 && axleDistance < 82005 && !hasDollyOrTrailer) return 32000;
            if (axleDistance >= 6000 && axleDistance < 6200 && !hasDollyOrTrailer) return 31000;
            if (axleDistance >= 5800 && axleDistance < 6000 && !hasDollyOrTrailer) return 30000;
            if (axleDistance >= 5600 && axleDistance < 5800 && !hasDollyOrTrailer) return 29000;
            if (axleDistance >= 5400 && axleDistance < 5600 && !hasDollyOrTrailer) return 28000;
            if (axleDistance >= 5200 && axleDistance < 5400 && !hasDollyOrTrailer) return 27000;
            if (axleDistance >= 4700 && axleDistance < 5200 && !hasDollyOrTrailer) return 26000;
            if (axleDistance >= 4400 && axleDistance < 4700 && !hasDollyOrTrailer) return 25000;
            if (axleDistance >= 2600 && axleDistance < 4400 && !hasDollyOrTrailer) return 24000;
            if (axleDistance >= 2000 && axleDistance < 2600 && !hasDollyOrTrailer) return 21000;
            if (axleDistance >= 1800 && axleDistance < 2000 && !hasDollyOrTrailer) return 20000;
            if (axleDistance >= 1300 && axleDistance < 1800 && !hasDollyOrTrailer) return 18000;
            if (axleDistance >= 1000 && axleDistance < 1300 && !hasDollyOrTrailer) return 16000;
            if (axleDistance < 1000 && !hasDollyOrTrailer) return 11500;
            return 0;

        case 2:
            if (axleDistance >= 18500) return 51400;
            if (axleDistance >= 18400 && axleDistance < 18500) return 51400;
            if (axleDistance >= 18200 && axleDistance < 18400) return 50520;
            if (axleDistance >= 18000 && axleDistance < 18200) return 50000;
            if (axleDistance >= 17800 && axleDistance < 18000) return 49480;
            if (axleDistance >= 17600 && axleDistance < 17800) return 48960;
            if (axleDistance >= 17400 && axleDistance < 17600) return 48440;
            if (axleDistance >= 17200 && axleDistance < 17400) return 47920;
            if (axleDistance >= 17000 && axleDistance < 17200) return 47400;
            if (axleDistance >= 16800 && axleDistance < 17000) return 46880;
            if (axleDistance >= 16600 && axleDistance < 16800) return 46360;
            if (axleDistance >= 16400 && axleDistance < 16600) return 45840;
            if (axleDistance >= 16200 && axleDistance < 16400) return 45320;
            if (axleDistance >= 16000 && axleDistance < 16200) return 44800;
            if (axleDistance >= 15800 && axleDistance < 16000) return 44280;
            if (axleDistance >= 15600 && axleDistance < 15800) return 43760;
            if (axleDistance >= 15400 && axleDistance < 15600) return 43240;
            if (axleDistance >= 15200 && axleDistance < 15400) return 42720;
            if (axleDistance >= 15000 && axleDistance < 15200) return 42200;
            if (axleDistance >= 14800 && axleDistance < 15000) return 41680;
            if (axleDistance >= 14600 && axleDistance < 14800) return 41160;
            if (axleDistance >= 14400 && axleDistance < 14600) return 40640;
            if (axleDistance >= 14200 && axleDistance < 14400) return 40120;
            if (axleDistance >= 14000 && axleDistance < 14200) return 39600;
            if (axleDistance >= 13800 && axleDistance < 14000) return 39080;
            if (axleDistance >= 13600 && axleDistance < 13800) return 38560;
            if (axleDistance >= 13400 && axleDistance < 13600) return 38040;
            if (axleDistance >= 11400 && axleDistance < 13400) return 38000;
            if (axleDistance >= 11200 && axleDistance < 11400) return 33040;
            if (axleDistance >= 11000 && axleDistance < 11200) return 32700;
            if (axleDistance >= 10800 && axleDistance < 11000) return 32360;
            if (axleDistance >= 10600 && axleDistance < 10800) return 32020;
            if (axleDistance >= 10400 && axleDistance < 10600) return 31680;
            if (axleDistance >= 10200 && axleDistance < 10400) return 31340;
            if (axleDistance >= 10000 && axleDistance < 10200) return 31000;
            if (axleDistance >= 9800 && axleDistance < 10000) return 30660;
            if (axleDistance >= 9600 && axleDistance < 9800) return 30320;
            if (axleDistance >= 9400 && axleDistance < 9600) return 29980;
            if (axleDistance >= 9200 && axleDistance < 9400) return 29640;
            if (axleDistance >= 9000 && axleDistance < 9200) return 29300;
            if (axleDistance >= 8800 && axleDistance < 9000) return 28960;
            if (axleDistance >= 8600 && axleDistance < 8800) return 28620;
            if (axleDistance >= 8400 && axleDistance < 8600) return 28280;
            if (axleDistance >= 8200 && axleDistance < 8400) return 27940;
            if (axleDistance >= 8000 && axleDistance < 8200) return 27600;
            if (axleDistance >= 7800 && axleDistance < 8000) return 27260;
            if (axleDistance >= 7600 && axleDistance < 7800) return 26920;
            if (axleDistance >= 7400 && axleDistance < 7600) return 26580;
            if (axleDistance >= 7200 && axleDistance < 7400) return 26240;
            if (axleDistance >= 7000 && axleDistance < 7200) return 25900;
            if (axleDistance >= 6800 && axleDistance < 7000) return 25560;
            if (axleDistance >= 6600 && axleDistance < 6800) return 25220;
            if (axleDistance >= 6400 && axleDistance < 6600) return 24880;
            if (axleDistance >= 6200 && axleDistance < 6400) return 24540;
            if (axleDistance >= 6000 && axleDistance < 6200) return 24200;
            if (axleDistance >= 5800 && axleDistance < 6000) return 23860;
            if (axleDistance >= 5600 && axleDistance < 5800) return 23520;
            if (axleDistance >= 5400 && axleDistance < 5600) return 23180;
            if (axleDistance >= 5200 && axleDistance < 5400) return 22840;
            if (axleDistance >= 5000 && axleDistance < 5200) return 22500;
            if (axleDistance >= 4800 && axleDistance < 5000) return 22160;
            if (axleDistance >= 2600 && axleDistance < 4800) return 22000;
            if (axleDistance >= 2000 && axleDistance < 2600) return 20000;
            if (axleDistance < 2000) return 16000;
            return 0;
        
        case 3:
            //finns fler!
            if (axleDistance === 22000) return 37500
            if (axleDistance >= 21600 && axleDistance < 22000) return 37000
            if (axleDistance >= 21200 && axleDistance < 21600) return 36500
            if (axleDistance >= 20800 && axleDistance < 21200) return 36000
            if (axleDistance >= 20400 && axleDistance < 20800) return 35500
            if (axleDistance >= 20000 && axleDistance < 20400) return 35000
            if (axleDistance >= 19600 && axleDistance < 20000) return 34500
            if (axleDistance >= 19200 && axleDistance < 19600) return 34000
            if (axleDistance >= 18800 && axleDistance < 19200) return 33500
            if (axleDistance >= 18400 && axleDistance < 18800) return 33000
            if (axleDistance >= 18000 && axleDistance < 18400) return 32500
            if (axleDistance >= 17600 && axleDistance < 18000) return 32000
            if (axleDistance >= 17200 && axleDistance < 17600) return 31500
            if (axleDistance >= 16800 && axleDistance < 17200) return 31000
            if (axleDistance >= 16400 && axleDistance < 16800) return 30500
            if (axleDistance >= 16000 && axleDistance < 16400) return 30000
            if (axleDistance >= 15600 && axleDistance < 16000) return 29500
            if (axleDistance >= 15200 && axleDistance < 15600) return 29000
            if (axleDistance >= 14800 && axleDistance < 15200) return 28500
            if (axleDistance >= 14400 && axleDistance < 14800) return 28000
            if (axleDistance >= 14000 && axleDistance < 14400) return 27500
            if (axleDistance >= 13600 && axleDistance < 14000) return 27000
            if (axleDistance >= 13200 && axleDistance < 13600) return 26500
            if (axleDistance >= 12800 && axleDistance < 13200) return 26000
            if (axleDistance >= 12400 && axleDistance < 12800) return 25500
            if (axleDistance >= 12000 && axleDistance < 12400) return 25000
            if (axleDistance >= 11600 && axleDistance < 12000) return 24500
            if (axleDistance >= 11200 && axleDistance < 11600) return 24000
            if (axleDistance >= 10800 && axleDistance < 11200) return 23500
            if (axleDistance >= 10400 && axleDistance < 10800) return 23000
            if (axleDistance >= 10000 && axleDistance < 10400) return 22500
            if (axleDistance >= 9600 && axleDistance < 10000) return 22000
            if (axleDistance >= 9200 && axleDistance < 9600) return 21500
            if (axleDistance >= 8800 && axleDistance < 9200) return 21000
            if (axleDistance >= 8400 && axleDistance < 8800) return 20500
            if (axleDistance >= 8000 && axleDistance < 8400) return 20000
            if (axleDistance >= 7600 && axleDistance < 8000) return 19500
            if (axleDistance >= 7200 && axleDistance < 7600) return 19000
            if (axleDistance >= 6800 && axleDistance < 7200) return 18500
            if (axleDistance >= 6400 && axleDistance < 6800) return 18000
            if (axleDistance >= 6000 && axleDistance < 6400) return 17500
            if (axleDistance >= 5600 && axleDistance < 6000) return 17000
            if (axleDistance >= 5200 && axleDistance < 5600) return 16500
            if (axleDistance >= 4800 && axleDistance < 5200) return 16000
            if (axleDistance >= 4400 && axleDistance < 4800) return 15500
            if (axleDistance >= 4000 && axleDistance < 4400) return 15000
            if (axleDistance >= 3600 && axleDistance < 4000) return 14500
            if (axleDistance >= 3200 && axleDistance < 3600) return 14000
            if (axleDistance >= 2800 && axleDistance < 3200) return 13500
            if (axleDistance >= 2400 && axleDistance < 2800) return 13000
            if (axleDistance >= 2000 && axleDistance < 2400) return 12500
            if (axleDistance < 2000) return 12000
            return 0

        case 4:
            if (axleDistance >= 20200) return 74000
            if (axleDistance >= 19700 && axleDistance < 20200) return 73000
            if (axleDistance >= 19200 && axleDistance < 19700) return 72000
            if (axleDistance >= 18700 && axleDistance < 19200) return 71000
            if (axleDistance >= 18200 && axleDistance < 18700) return 70000
            if (axleDistance >= 17800 && axleDistance < 18200) return 69000
            if (axleDistance >= 17400 && axleDistance < 17800) return 68000
            if (axleDistance >= 17000 && axleDistance < 17400) return 67000
            if (axleDistance >= 16600 && axleDistance < 17000) return 66000
            if (axleDistance >= 16200 && axleDistance < 16600) return 65000
            if (axleDistance >= 15800 && axleDistance < 16200) return 64000
            if (axleDistance >= 15400 && axleDistance < 15800) return 63000
            if (axleDistance >= 15000 && axleDistance < 15400) return 62000
            if (axleDistance >= 14600 && axleDistance < 15000) return 61000
            if (axleDistance >= 14200 && axleDistance < 14600) return 60000
            if (axleDistance >= 13800 && axleDistance < 14200) return 59000
            if (axleDistance >= 13400 && axleDistance < 13800) return 58000
            if (axleDistance >= 13000 && axleDistance < 13400) return 57000
            if (axleDistance >= 12600 && axleDistance < 13000) return 56000
            if (axleDistance >= 12200 && axleDistance < 12600) return 55000
            if (axleDistance >= 11800 && axleDistance < 12200) return 54000
            if (axleDistance >= 11400 && axleDistance < 11800) return 53000
            if (axleDistance >= 11000 && axleDistance < 11400) return 52000
            if (axleDistance >= 10600 && axleDistance < 11000) return 51000
            if (axleDistance >= 10200 && axleDistance < 10600) return 50000
            if (axleDistance >= 10000 && axleDistance < 10200) return 49000
            if (axleDistance >= 9800 && axleDistance < 10000) return 48000
            if (axleDistance >= 9600 && axleDistance < 9800) return 47000
            if (axleDistance >= 9400 && axleDistance < 9600) return 46000
            if (axleDistance >= 9200 && axleDistance < 9400) return 45000
            if (axleDistance >= 9000 && axleDistance < 9200) return 44000
            if (axleDistance >= 8800 && axleDistance < 9000) return 43000
            if (axleDistance >= 8600 && axleDistance < 8800) return 42000
            if (axleDistance >= 8400 && axleDistance < 8600) return 41000
            if (axleDistance >= 8200 && axleDistance < 8400) return 40000
            if (axleDistance >= 8000 && axleDistance < 8200) return 39000
            if (axleDistance >= 7800 && axleDistance < 8000) return 38000
            if (axleDistance >= 7600 && axleDistance < 7800) return 37000
            if (axleDistance >= 7200 && axleDistance < 7600) return 36000
            if (axleDistance >= 7000 && axleDistance < 7200) return 35000
            if (axleDistance >= 6800 && axleDistance < 7000) return 34000
            if (axleDistance >= 6400 && axleDistance < 6800) return 33000
            if (axleDistance >= 6200 && axleDistance < 6400) return 32000
            if (axleDistance >= 6000 && axleDistance < 6200) return 31000
            if (axleDistance >= 5800 && axleDistance < 6000) return 30000
            if (axleDistance >= 5600 && axleDistance < 5800) return 29000
            if (axleDistance >= 5400 && axleDistance < 5600) return 28000
            if (axleDistance >= 5200 && axleDistance < 5400) return 27000
            if (axleDistance >= 4700 && axleDistance < 5200) return 26000
            if (axleDistance >= 4400 && axleDistance < 4700) return 25000
            if (axleDistance >= 2600 && axleDistance < 4400) return 24000
            if (axleDistance >= 2000 && axleDistance < 2600) return 21000
            if (axleDistance >= 1800 && axleDistance < 2000) return 20000
            if (axleDistance >= 1300 && axleDistance < 1800) return 18000
            if (axleDistance >= 1000 && axleDistance < 1300) return 16000
            if (axleDistance < 1000) return 11500
            return 0;
    }
}

export function singleAxlePressure(bk: 1|2|3|4, drivingAxle: boolean = false): number {
    switch (bk) {
        case 1:
        case 4:
            if (drivingAxle) {
                return 11500
            } else {
                return 10000
            }
        case 2:
            return 10000;
        case 3:
            return 8000;
    }
}

export function boggiPressure(axleDistance: number, bkNum: 1|2|3|4, hasGoodSuspension: boolean = true): number {
    switch (bkNum) {
        case 1:
        case 4:
            if (axleDistance < 1000) {
                return 11500;
            } else if (axleDistance >= 1000 && axleDistance < 1300){
                return 16000;
            } else if (axleDistance >= 1300 && axleDistance < 1800) {
                if (!hasGoodSuspension) {
                    return 18000;
                } else {
                    return 19000;
                }
            } else if (axleDistance >= 1800 && axleDistance < 2000) {
                return 20000
            }
            return 0;

        case 2:
            if (axleDistance < 1000) {
                return 11500;
            } else if (axleDistance >= 1000 && axleDistance < 1300){
                return 16000;
            } else if (axleDistance >= 1300 && axleDistance < 1800) {
                if (!hasGoodSuspension) {
                    return 16000;
                } else {
                    return 16000;
                }
            } else if (axleDistance >= 1800 && axleDistance < 2000) {
                return 16000
            }
            return 0;

        case 3:
            if (axleDistance < 1000) {
                return 11500;
            } else if (axleDistance >= 1000 && axleDistance < 1300){
                return 12000;
            } else if (axleDistance >= 1300 && axleDistance < 1800) {
                if (!hasGoodSuspension) {
                    return 12000;
                } else {
                    return 12000;
                }
            } else if (axleDistance >= 1800 && axleDistance < 2000) {
                return 12000
            }
            return 0;
    }
}

export function trippleAxlePressure(axleDistance: number, bkNum: 1|2|3|4): number {
    switch (bkNum) {
        case 1:
        case 4:
            if (axleDistance < 2600) {
                return 21000;
            } else if (axleDistance >= 2600 && axleDistance < 4400) {
                return 24000
            } else if (axleDistance >= 4400 && axleDistance < 4700) {
                return 25000;
            } else if (axleDistance >= 4700 && axleDistance < 5000) {
                return 26000;
            }
            return 0;
            
        case 2:
            if (axleDistance < 2600) {
                return 20000;
            } else if (axleDistance >= 2600 && axleDistance < 4400) {
                return 22000
            } else if (axleDistance >= 4400 && axleDistance < 4700) {
                return 22000;
            } else if (axleDistance >= 4700 && axleDistance < 5000) {
                return 22000;
            }
            return 0;    

        case 3:
            if (axleDistance < 2600) {
                return 13000;
            } else if (axleDistance >= 2600 && axleDistance < 4400) {
                return 13000
            } else if (axleDistance >= 4400 && axleDistance < 4700) {
                return 13000;
            } else if (axleDistance >= 4700 && axleDistance < 5000) {
                return 13000;
            }
            return 0;    
    }
}

export function maxWeightPerAxle(axleCount: number, bioFuel: boolean, hasGoodSuspension: boolean = true): number {
    switch (axleCount) {
        case 2:
            if(bioFuel){
                return 19000;
            } else {
                return 18000;
            }
        case 3:
            if (hasGoodSuspension) {
                if (bioFuel) {
                    return 29000;
                } else {
                    return 28000;
                }
            } else {
                if (bioFuel) {
                    return 26000;
                } else {
                    return 25000;
                }
            }
        default:
            if (hasGoodSuspension){
                return 32000;
            } else {
                return 31000;
            }
    }
}

export function calculateMaxLoadWeight(truck: Truck, bkNum: 1|2|3|4): number {
    let totalAxleDistance: number =  0; 
    truck.axleDistances?.split("/").forEach((v) => totalAxleDistance += Number(v));
    
    let maxVehicleWeight = 0;
    let maxBkWeight = bk(totalAxleDistance, bkNum, false);

    const axleGroups = determineAxleGroups(truck);
    let garanteedAxleLoads: number[] = [];
    truck.garanteedAxleLoad?.split("+").forEach(weight => garanteedAxleLoads.push(Number(weight))); 
    let biggestAxleDistance = Number(truck.axleDistances.split("/").sort((a,b) => Number(b)-Number(a))[0]);

    let currentAxleIsFrontGroup: boolean = true;
    const groupWeights: number[] = []
    axleGroups.forEach((group, i) => {
        if (Number(truck.axleDistances.split("/")[i]) === biggestAxleDistance) currentAxleIsFrontGroup = false;
        switch (group.axleGroup) {
            case 1: 
                if (!currentAxleIsFrontGroup) {
                    if (groupWeights.length === 0) {
                        groupWeights.push(singleAxlePressure(bkNum, axleGroups.length === 2 && i == 1));
                    } else {
                        groupWeights[groupWeights.length - 1] += singleAxlePressure(bkNum, axleGroups.length === 2 && i == 1);
                    }
                } else {
                    groupWeights.push(singleAxlePressure(bkNum, axleGroups.length === 2 && i == 1));
                }
                break;
            case 2:
                groupWeights.push(boggiPressure(Number(truck.axleDistances.split("/")[i]), bkNum, truck.addtitionalData.goodSuspension))
                break;
            case 3:
                groupWeights.push(trippleAxlePressure(group.axleDistanceBoggiOrTriple, bkNum))
        }


    })

    for (let i = 0; i < groupWeights.length; i++) {
        const garanteedAxleLoad = Number(truck.garanteedAxleLoad?.split("+")[i]);
        if (groupWeights[i] > garanteedAxleLoad) {
            maxVehicleWeight += garanteedAxleLoad
        } else {
            maxVehicleWeight += groupWeights[i];
        }
    }

    let finalMax = maxVehicleWeight;
    if (finalMax > maxBkWeight) finalMax = maxBkWeight;
    if (finalMax > truck.taxWeight) finalMax = truck.taxWeight;
    if (finalMax > maxWeightPerAxle(truck.axleCount, truck.fuel === "Biodiesel", truck.addtitionalData.goodSuspension)) finalMax = maxWeightPerAxle(truck.axleCount, truck.fuel === "Biodiesel", truck.addtitionalData.goodSuspension);

    return finalMax-truck.serviceWeight;
}



/**
 * Determines if every axle distance can be joined into tripleaxle, boggy or single.
 * @param truck 
 */
export function determineAxleGroups(truck: Truck): {axleGroup: number, axleDistanceBoggiOrTriple: number}[] {
    const axleGroups: number[] = [];
    const numberDistances: number[] = [];
    let numOfAxleDistances = truck.axleDistances.split("/").length;
    let totalAxleDistance = 0;
    truck.axleDistances.split("/").forEach(distance => {
        totalAxleDistance += Number(distance);
    })
    if (numOfAxleDistances === 1) {
        axleGroups.push(1);
        axleGroups.push(1);
        let t = 0;
        return axleGroups.map(group => { 
            return {axleGroup: group, axleDistanceBoggiOrTriple: group === 1 ? 0 : totalAxleDistance}
        }) 
        
    }
    if (numOfAxleDistances === 2 && totalAxleDistance < 5000) {
        return [{axleGroup: 3, axleDistanceBoggiOrTriple: totalAxleDistance}];
    }
    for(let i = 1; i <= numOfAxleDistances; i++) {
        if (Number(truck.axleDistances?.split("/")[i-1]) + Number(truck.axleDistances?.split("/")[i]) < 5000) {
            //i-1 och i är tillsammans en trippelaxel
            axleGroups.push(3);
            numberDistances.push(Number(truck.axleDistances?.split("/")[i-1]) + Number(truck.axleDistances?.split("/")[i]))
            i++
        } else if (Number(truck.axleDistances?.split("/")[i-1]) < 2000) {
            //i-1  (första distansen är en boggi)
            axleGroups.push(2);
            numberDistances.push(Number(truck.axleDistances?.split("/")[i-1]))
        } else {
            //i-1 är en enkel axel
            axleGroups.push(1);
        }
    }
    return axleGroups.map((group) => { 
        const ret = {axleGroup: group, axleDistanceBoggiOrTriple: group === 1 ? 0 : numberDistances[0]}
        if (group !== 1) numberDistances.shift();
        return ret;
    })
}