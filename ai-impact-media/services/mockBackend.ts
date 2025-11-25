import { CastingSubmission, SponsorSubmission } from '../types';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockBackend = {
  /**
   * Simulates creating a folder in Google Drive based on the user's handle
   * and uploading files to it.
   */
  uploadCastingData: async (data: CastingSubmission): Promise<{ success: boolean; message: string }> => {
    console.log(`[Backend] Authenticating...`);
    await delay(800);
    
    // Simulate dynamic folder creation
    const folderName = `Casting_${data.socialHandle.replace('@', '')}_${Date.now()}`;
    console.log(`[Backend] Created Google Drive Folder: /AI_Impact_Casting/${folderName}`);
    
    // Simulate file uploads
    console.log(`[Backend] Uploading ${data.images.length} images to ${folderName}...`);
    data.images.forEach(img => console.log(`   - Uploaded: ${img.name} (${(img.size / 1024).toFixed(2)} KB)`));
    
    if (data.audio) {
      console.log(`[Backend] Uploading audio to ${folderName}...`);
      console.log(`   - Uploaded: ${data.audio.name}`);
    }

    // Simulate database entry
    console.log(`[Backend] Saving metadata to database for user: ${data.email}`);
    
    // Simulate Email Sending
    console.log(`[Backend] Sending confirmation email to ${data.email}...`);
    console.log(`   > Subject: Submission Received - AI Impact Media`);
    console.log(`   > Body: Hello ${data.name}, we have received your casting submission. Please note this is a voluntary project with no financial compensation. Thank you!`);

    await delay(1200);
    return { success: true, message: 'Submission uploaded successfully.' };
  },

  submitSponsorship: async (data: SponsorSubmission): Promise<{ success: boolean; message: string }> => {
    console.log(`[Backend] Processing sponsorship inquiry from ${data.companyName}...`);
    await delay(1000);
    
    console.log(`[Backend] Sending auto-reply to ${data.email}...`);
    console.log(`   > Subject: Thank you for your interest in AI Impact Media`);
    
    return { success: true, message: 'Inquiry sent. We will contact you shortly.' };
  },

  trackUserLogin: (userId: string) => {
    console.log(`[Analytics] User Login Tracked: ${userId} at ${new Date().toISOString()}`);
  }
};