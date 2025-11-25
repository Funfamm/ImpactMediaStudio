import { Submission } from "../types";

// Simulate database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadToDriveSimulation = async (handle: string, files: File[]): Promise<string[]> => {
    // Logic: Create a folder inside "Incoming Uploads" for this user
    const folderPath = `AI Impact Media/Casting Submissions/${handle}/`;
    
    console.group("Google Drive Simulation");
    console.log(`[Drive] Authenticating... OK`);
    console.log(`[Drive] Checking for folder: '${folderPath}'`);
    console.log(`[Drive] Folder not found. Creating '${folderPath}'...`);
    await delay(1000); // Simulate network
    
    const fileUrls: string[] = [];
    
    console.log(`[Drive] Uploading ${files.length} files to '${folderPath}'...`);
    
    for (const file of files) {
        console.log(`  - Uploading: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        await delay(500); // Simulate upload time per file
        fileUrls.push(`https://drive.google.com/drive/folders/mock_id_${handle}/${file.name}`);
    }
    
    console.log(`[Drive] All files uploaded successfully.`);
    console.groupEnd();
    
    return fileUrls;
};

export const sendConfirmationEmail = async (email: string, name: string, type: 'casting' | 'sponsor' = 'casting'): Promise<void> => {
    console.group("Email Service Simulation");
    console.log(`[Email] Sending to: ${email}`);
    await delay(800);
    
    let subject = "";
    let body = "";

    if (type === 'casting') {
        subject = "Submission Received - AI Impact Media Casting";
        body = `
        Dear ${name},

        Thank you for submitting your casting materials to AI Impact Media. 
        
        We have successfully received your files and they have been archived in our secure casting database.
        
        Please remember that this is a voluntary community project. There is no financial compensation provided for participation. Your contribution helps build a new era of storytelling.

        We appreciate your talent and passion.

        Best Regards,
        The AI Impact Media Team
        `;
    } else {
        subject = "Sponsorship Inquiry - AI Impact Media";
        body = `
        Dear ${name},

        Thank you for reaching out to AI Impact Media.
        
        We acknowledge receipt of your sponsorship inquiry. Our team will review your proposal and get back to you shortly with more details on how we can collaborate.

        Best Regards,
        AI Impact Media Partnership Division
        `;
    }

    console.log(`[Email] Subject: ${subject}`);
    console.log(`[Email] Body Preview: ${body.substring(0, 100)}...`);
    console.log(`[Email] Sent Successfully.`);
    console.groupEnd();
};

export const saveSubmission = async (submission: Submission): Promise<void> => {
    const existing = JSON.parse(localStorage.getItem('submissions') || '[]');
    existing.push(submission);
    localStorage.setItem('submissions', JSON.stringify(existing));
    await delay(500);
};

export const getSubmissions = (): Submission[] => {
    return JSON.parse(localStorage.getItem('submissions') || '[]');
};