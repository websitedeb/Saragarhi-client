import { FormFactory } from "@/components/Factory/form";
import { Schema } from "@/constants/constants";
import { protectRoute } from "@/hooks/session";
import { useEffect } from "react";

export default function Scout() {

    useEffect(() => {
        protectRoute();
    }, []);

    return (
        <FormFactory schema={Schema} />
    );
}
