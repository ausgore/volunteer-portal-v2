import { useParams } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { useEffect, useState } from "react";
import { Training } from "../../utils/classes/Training";
import TrainingManager from "../../utils/managers/TrainingManager";
import Loading from "../components/Loading";

export default function TrainingPage() {
    const { id } = useParams();
    const [training, setTraining] = useState<Training>();
    useEffect(() => {
        (async () => {
            const training = await TrainingManager.fetch({ id }) as Training;
            console.log(training);
            setTraining(training);
        })();
    }, []);

    return <Wrapper>
        {!training ? <Loading className="h-screen items-center" /> : <div className="p-4">
            <pre>{JSON.stringify(training, null, 2)}</pre>
        </div>}
    </Wrapper>
}