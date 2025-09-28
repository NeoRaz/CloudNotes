<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $view;
    public $subject;
    public $details;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($view, $subject, $details)
    {
        $this->view = $view;
        $this->subject = $subject;
        $this->details = $details;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(config('email.from-email'))
            ->view($this->view)
            ->subject($this->subject)
            ->with($this->details);
    }
}
