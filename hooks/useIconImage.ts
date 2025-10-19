const GenderUrl = (name : string) => {
    return `https://api.genderize.io/?name=${name}`;
}

const ImageUrl = (gender: string, name: string): string => {
    if (gender === "female") {
        return `https://avatar.iran.liara.run/public/girl?name=${name}`;
    }
    return `https://avatar.iran.liara.run/public/boy?name=${name}`;
}

export default async function useImageIcon(name: string) {
    const pre = await fetch(GenderUrl(name));
    const data = await pre.json();
    const gender = data.gender;

    return ImageUrl(gender, name);
}
