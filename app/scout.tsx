import { FormFactory } from "@/components/Factory/form";
import formSchema from "@/constants/form_schema.json";

export default function Scout() {
    return (
        <FormFactory schema={formSchema} />
    );
}
