import React from 'react';

interface EvidenceProps {
    evidenceType: string;
    description: string;
    link: string;
}

const Evidence: React.FC<EvidenceProps> = ({ evidenceType, description, link }) => {
    return (
        <div className="evidence">
            <h3>{evidenceType}</h3>
            <p>{description}</p>
            {link && (
                <a href={link} target="_blank" rel="noopener noreferrer">
                    View Evidence
                </a>
            )}
        </div>
    );
};

export default Evidence;