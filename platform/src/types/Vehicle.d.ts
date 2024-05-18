interface Vehicle {
    //fordonsidentitet och kaross
    licensePlateNum?: string,
    year?: number,
    width?: number,
    cargoLength?: number,
    make?: string,
    vehicleCategory?: string,
    color?: string,
    equipment?: string,
    overhangFrontBack?: string,
    tradeName?: string,
    length?: number,
    seats?: number,
    bodyWorkType?: string,
    identificationNum?: string,
    variant?: undefined,
    typeAllowance?: undefined,
    version?: undefined,

    //vikter
    serviceWeight: number,
    totalWeight: number,
    taxWeight: number,
    garanteedAxleLoad: string,
    maxLoad?: number,
    highestTotalWeightForBk1?: number,
    allowedLoadWeight?: number,
    allowedWeightPerAxleGroup?: number,
    allowedWeightPerAxle?: number,
    highestWeightTrailer?: number,
    highestWeightSläpkärra?: number,
}

interface Truck extends Vehicle {
    //motor och effekt
    maximumNettoEffect?: string,
    fuel?: string,
    strokeVolume?: number,
    gearbox?: string,

    //axlar och hjul
    axleCount: number,
    axleDistances: string,
    wheelDimensionRear?: string,
    wheelCount?: number,
    drivingAxlesFrontBack?: number,

    //miljöfakta

    //kopplingsanordning
    couplingType?: string,
    brakeOutlet?: string,
    highestWeightNoneBreakingTrailer?: number,
    couplingDistance?: number,
    highestWeightBreakingTrailer?: number,
    couplingLoad?: string,
    highestTotalWeightTrailerForBLicense?: number,

    addtitionalData: AdditionalData

}

interface Trailer extends Vehicle {
    //kopplingsanordning
    couplingType?: string,
    brakeOutlet?: string,
    tractorTrailer?: any,
    couplingDistance?: number,
    brakeMechanism?: string,
    couplingLoad?: number,
    
    //axlar och hjul
    axleCount?: number,
    wheelDimensionBack?: string,
    axleDistances?: string,

    additionalData?: AdditionalData
}

interface AdditionalData {
    dValue?: number,
    sValue?: number,
    dcValue?: number,
    goodSuspension?: boolean
    other: any
}