<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Mail\SendEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;

class EmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $details;

    /**
     * Create a new job instance.
     */
    public function __construct($details)
    {
        $this->details = $details;
    }

    /**
     * Execute the job.
     */
   public function handle()
    {
        $smtpHost = config('mail.mailers.smtp.host');
        $email = new SendEmail($this->details['view'], $this->details['subject'], $this->details['details']);

        try {
            if ($smtpHost === 'smtp-relay.brevo.com') {
                // Render HTML from the Mailable
                $htmlContent = $email->render();

                // Send via Brevo API
                $response = Http::withHeaders([
                    'api-key' => config('mail.mailers.smtp.brevo_api_key'),
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])->post('https://api.brevo.com/v3/smtp/email', [
                    'sender' => [
                        'name' => config('mail.from.name'),
                        'email' => config('mail.from.address'),
                    ],
                    'to' => [
                        ['email' => $this->details['email'], 'name' => $this->details['details']['name'] ?? 'Client'],
                    ],
                    'subject' => $this->details['subject'],
                    'htmlContent' => $htmlContent,
                ]);

                if (!$response->successful()) {
                    throw new \Exception('Brevo API failed: ' . $response->body());
                }

                Log::channel('email')->info("Email via Brevo sent to {$this->details['email']}: {$response->body()}");
            } else {
                // Normal SMTP
                Mail::to($this->details['email'])->send($email);
                Log::channel('email')->info("Email via SMTP sent to {$this->details['email']}");
            }
        } catch (\Exception $e) {
            Log::channel('email')->error("Failed to send email to {$this->details['email']}: {$e->getMessage()}");
            $this->release(60); // retry after 60 seconds
        }
    }

}
