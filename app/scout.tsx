import { FormFactory } from "@/components/Factory/form";
import formSchema from "@/constants/form_schema.json";
import { protectRoute } from "@/hooks/session";
import { useEffect } from "react";

export default function Scout() {
    useEffect(() => {
        protectRoute();
    }, []);

    return (
        <FormFactory schema={formSchema} />
    );
}
