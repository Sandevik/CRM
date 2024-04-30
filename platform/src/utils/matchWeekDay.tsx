import Text from "@/components/Text";

export const matchWeekDay = (num: number): React.JSX.Element | "" => {
    switch (num) {
        case 0:
            return <Text text={{eng: "Sunday", swe: "Söndag"}} />;
        case 1:
            return <Text text={{eng: "Monday", swe: "Måndag"}} />;
        case 2:
            return <Text text={{eng: "Tuesday", swe: "Tisdag"}} />;
        case 3:
            return <Text text={{eng: "Wednesday", swe: "Onsdag"}} />;
        case 4:
            return <Text text={{eng: "Thursday", swe: "Torsdag"}} />;
        case 5:
            return <Text text={{eng: "Friday", swe: "Fredag"}} />;
        case 6:
            return <Text text={{eng: "Saturday", swe: "Lördag"}} />; 
        default: 
            return "";
    }
}