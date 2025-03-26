export const timestampToDate = (value: any) => {
    let date;
    if (typeof value === 'string') {
        date = new Date(value);
    } else {
        date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
    }
    return date.toLocaleString();
}