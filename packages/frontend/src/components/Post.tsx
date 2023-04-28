import React from 'react'
import './button.css'

import User from '../contexts/User'

type Props = {
  epochKey: any,
  minRep: any,
  publicSignals: any,
  proof: any
}

export default ({ epochKey, minRep, publicSignals, proof }: Props) => {
  const userContext = React.useContext(User)
  const [valid, setValid] = React.useState<Boolean>(false);

  React.useEffect(() => {
    const checkProof = async () => {
      const resProof = await userContext.proveOutput(
        publicSignals,
        proof
      )
      setValid(resProof.valid);
    };

    checkProof();
  }, []);

  return (
    <div>
      <div>
        Epoch Key:  {epochKey.toString()}
      </div>
      <div>
        Min Rep: {minRep.toString()}
      </div>
      <div>
        {
          valid ?
            'Proof Valid' :
            'Not Valid'
        }
      </div>
    </div>
  )
}
