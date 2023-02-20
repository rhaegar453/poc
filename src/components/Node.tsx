import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import styled from '@emotion/styled';

const NodeContainer = styled.div`
border: ${({ color }) => `1px solid ${color || '#330000'}`};
border-radius:15px;
transition:0.3s;
padding:5px 20px;
background-color:white;
`;


function Node({ data, ...rest }: { data: { label: string, color: string } }) {
    const { label, color } = data;
    console.log(rest)
    return (
        <>
            <Handle type="target" position={Position.Top} />
            <NodeContainer color={color}>
                <p>{label}</p>
            </NodeContainer>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}


export default Node;

