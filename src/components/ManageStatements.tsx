import React, { useState } from 'react';

const ManageStatements: React.FC = () => {
    const [statements, setStatements] = useState<string[]>([]);
    const [newStatement, setNewStatement] = useState<string>('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewStatement(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (editingIndex !== null) {
            const updatedStatements = [...statements];
            updatedStatements[editingIndex] = newStatement;
            setStatements(updatedStatements);
            setEditingIndex(null);
        } else {
            setStatements([...statements, newStatement]);
        }
        setNewStatement('');
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setNewStatement(statements[index]);
    };

    const handleDelete = (index: number) => {
        const updatedStatements = statements.filter((_, i) => i !== index);
        setStatements(updatedStatements);
    };

    return (
        <div>
            <h2>Manage Statements</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newStatement}
                    onChange={handleInputChange}
                    placeholder="Enter your statement"
                />
                <button type="submit">{editingIndex !== null ? 'Update' : 'Add'}</button>
            </form>
            <ul>
                {statements.map((statement, index) => (
                    <li key={index}>
                        {statement}
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => handleDelete(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageStatements;