import { useCallback, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import styled from '@emotion/styled';

const NodeContainer = styled.div`
border:1px solid #333333;
border-radius:15px;
transition:0.3s;
padding:5px 20px;
background-color: ${({ color }) => `${color || 'white!important'}`};
`;


function Node({ data, ...rest }: { data: { label: string, color: string } }) {
    const { label, color } = data;
    const [open, setOpen] = useState<boolean>();
    const { fitView } = useReactFlow();
    return (
        <>
            <Handle type="target" position={Position.Top} />
            <NodeContainer color={color} onMouseOver={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <p>{label}</p>
            </NodeContainer>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}


export default Node;

