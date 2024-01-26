export default function (ref: React.MutableRefObject<any>) {
    return ref.current?.scrollHeight > ref.current?.clientHeight;
}