import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ElectionABI from './ElectionABI';

const CONTRACT_ADDRESS = '0x512eAa98d0C438bbD6fa9288f7F8C95DBf55124D';

function App() {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        async function fetchData() {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, ElectionABI, signer);

                const candidatesCount = await contract.candidatesCount();
                let candidatesArray = [];
                for (let i = 1; i <= candidatesCount.toNumber(); i++) {
                    const candidate = await contract.candidates(i);
                    candidatesArray.push({
                        id: candidate.id.toNumber(),
                        name: candidate.name,
                        voteCount: candidate.voteCount.toString() // Convert BigNumber to string
                    });
                }
                setCandidates(candidatesArray);
            } else {
                console.log("Please install MetaMask");
            }
        }
        fetchData();
    }, []);

    const vote = async () => {
        if (selectedCandidate) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ElectionABI, signer);
            await contract.vote(selectedCandidate.id);
            alert("Vote cast successfully!");
        }
    };

    return (
        <div className="App">
            <h1>Blockchain Voting System</h1>
            <h2>Candidates</h2>
            <ul>
                {candidates.map((candidate, index) => (
                    <li key={index}>
                        {candidate.name} - Votes: {candidate.voteCount}
                        <button onClick={() => setSelectedCandidate(candidate)}>Vote</button>
                    </li>
                ))}
            </ul>
            <button onClick={vote}>Cast Vote</button>
        </div>
    );
}

export default App;
