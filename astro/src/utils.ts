function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = 
        {month: 'long', day: 'numeric', year: 'numeric'};
    return new Date(date).toLocaleDateString(undefined, options);
} 

export { formatDate };