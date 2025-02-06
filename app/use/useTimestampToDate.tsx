export const timestampToDate = (value: any) => {
    const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
    return date.toLocaleString();
}