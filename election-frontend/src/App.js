import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ElectionABI from './ElectionABI';
import './App.css';

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
                        voteCount: candidate.voteCount.toString()
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
            <header className="app-header">
                <h1>Blockchain Voting System</h1>
            </header>
            <main className="app-content">
                <h2>Candidates</h2>
                <div className="candidates-list">
                    {candidates.map((candidate, index) => (
                        <div key={index} className="candidate-card">
                            <span className="candidate-name">{candidate.name}</span>
                            <span className="candidate-votes">Votes: {candidate.voteCount}</span>
                            <button 
                                className="vote-button" 
                                onClick={() => setSelectedCandidate(candidate)}
                            >
                                Vote
                            </button>
                        </div>
                    ))}
                </div>
                <button className="cast-vote-button" onClick={vote}>Cast Vote</button>
            </main>
        </div>
    );
}

export default App;
