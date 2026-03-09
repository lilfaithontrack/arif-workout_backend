const fetch = require('node-fetch'); // If not available, we can just use the native fetch in Node 18+

async function testFetch() {
    try {
        console.log('Fetching strength exercises...');
        const response = await fetch('http://localhost:5000/api/exercises?limit=50&category=strength');
        console.log('Status:', response.status);

        if (!response.ok) {
            const text = await response.text();
            console.error('Error response text:', text);
            return;
        }

        const data = await response.json();
        console.log('Success!', data.success);
        console.log('Total exercises count:', data.count);

        if (data.data && data.data.exercises && data.data.exercises.length > 0) {
            console.log('First exercise example:');
            console.log(data.data.exercises[0].name);
            console.log('Muscle Groups:', data.data.exercises[0].muscleGroups);
        } else {
            console.log('No exercises returned in the data array.');
        }

        console.log('\n--- Fetching Chest Exercises ---');
        const responseChest = await fetch('http://localhost:5000/api/exercises?limit=50&muscleGroup=chest');
        console.log('Status:', responseChest.status);
        const dataChest = await responseChest.json();
        console.log('Success:', dataChest.success);
        console.log('Total chest exercises:', dataChest.count);

    } catch (error) {
        console.error('Test script error:', error);
    }
}

testFetch();
