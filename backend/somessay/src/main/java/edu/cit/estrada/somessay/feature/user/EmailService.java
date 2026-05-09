package edu.cit.estrada.somessay.feature.user;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.name}")
    private String appName;

    @Async
    public void sendWelcomeEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("welcome to somessay. 🌿");

            String html = """
                <div style="font-family: 'Georgia', serif; max-width: 480px; margin: 0 auto; padding: 2rem; background-color: #EED59F; border-radius: 16px;">
                    <h1 style="font-size: 2rem; color: #2c2c2c; margin-bottom: 0.5rem;">somessay.</h1>
                    <p style="color: #5C3D1E; font-size: 0.9rem; margin-bottom: 2rem;">a place to tell your written roots.</p>
                    <h2 style="color: #2c2c2c; font-weight: normal;">welcome, %s! 🌿</h2>
                    <p style="color: #2c2c2c; line-height: 1.7;">
                        you've just entered the seasons. somessay is your space to write,
                        reflect, and share your written roots with the world.
                    </p>
                    <div style="margin-top: 2rem; padding: 1rem; background-color: #59643A; border-radius: 8px; text-align: center;">
                        <a href="http://localhost:5173/create"
                           style="color: #ffffff; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 1rem;">
                            write your first branch →
                        </a>
                    </div>
                    <p style="color: #7A5C3A; font-size: 0.8rem; margin-top: 2rem; text-align: center;">
                        with love, the somessay team 🍂
                    </p>
                </div>
            """.formatted(username);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    @Async
    public void sendLikeNotificationEmail(String toEmail, String ownerUsername,
                                          String likerUsername, String articleTitle) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("someone liked your branch on somessay. 🌿");

            String html = """
                <div style="font-family: 'Georgia', serif; max-width: 480px; margin: 0 auto; padding: 2rem; background-color: #EED59F; border-radius: 16px;">
                    <h1 style="font-size: 2rem; color: #2c2c2c; margin-bottom: 0.5rem;">somessay.</h1>
                    <h2 style="color: #2c2c2c; font-weight: normal;">hey, %s! 🍂</h2>
                    <p style="color: #2c2c2c; line-height: 1.7;">
                        <strong>@%s</strong> just liked your branch:
                    </p>
                    <div style="margin: 1rem 0; padding: 1rem; background-color: #ffffff; border-radius: 8px; border-left: 4px solid #D37B27;">
                        <p style="color: #2c2c2c; font-size: 1.1rem; margin: 0;">"%s"</p>
                    </div>
                    <p style="color: #2c2c2c; line-height: 1.7;">your words are reaching people. keep writing! 🌿</p>
                    <div style="margin-top: 2rem; padding: 1rem; background-color: #59643A; border-radius: 8px; text-align: center;">
                        <a href="http://localhost:5173/feed"
                           style="color: #ffffff; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 1rem;">
                            go to somessay →
                        </a>
                    </div>
                    <p style="color: #7A5C3A; font-size: 0.8rem; margin-top: 2rem; text-align: center;">
                        with love, the somessay team 🍂
                    </p>
                </div>
            """.formatted(ownerUsername, likerUsername, articleTitle);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send like notification email: " + e.getMessage());
        }
    }
}