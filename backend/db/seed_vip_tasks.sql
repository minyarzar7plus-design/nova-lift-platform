-- 40 task examples per membership level (VIP 1 through VIP 5): 200 rows total.
-- These are catalog/workflow tasks only; no payment, balance, reward, or withdrawal data is included.
WITH task_templates AS (
  SELECT * FROM (VALUES
    (1, 'Profile', 'Complete an assigned profile quality check', 'Quality', 8),
    (2, 'Navigation', 'Review an assigned navigation flow', 'Quality', 10),
    (3, 'Accessibility', 'Perform an accessibility review for the assigned page', 'Quality', 15),
    (4, 'Content', 'Proofread an assigned product update', 'Content', 12),
    (5, 'FAQ', 'Improve clarity in an assigned help article', 'Content', 15),
    (6, 'Survey', 'Complete an approved feature feedback survey', 'Research', 10),
    (7, 'Interview', 'Answer a structured usability questionnaire', 'Research', 18),
    (8, 'Search', 'Rate the relevance of assigned search results', 'Research', 12),
    (9, 'Metadata', 'Validate catalog metadata for assigned records', 'Catalog', 15),
    (10, 'Tags', 'Apply approved category tags to assigned items', 'Catalog', 12),
    (11, 'Support', 'Review an approved support response template', 'Operations', 15),
    (12, 'Data check', 'Validate an assigned non-sensitive data sample', 'Operations', 18),
    (13, 'Planning', 'Create a structured weekly workspace checklist', 'Productivity', 12),
    (14, 'Security', 'Complete an account-security awareness exercise', 'Security', 10),
    (15, 'Privacy', 'Review privacy-setting wording for clarity', 'Security', 12),
    (16, 'Community', 'Review an approved community resource', 'Community', 15),
    (17, 'Event', 'Complete feedback for an approved community event', 'Community', 8),
    (18, 'Dashboard', 'Test an assigned dashboard view and report usability feedback', 'Product testing', 15),
    (19, 'Notifications', 'Review an assigned notification message for clarity', 'Product testing', 10),
    (20, 'Ideas', 'Submit one structured product-improvement idea', 'Product testing', 12),
    (21, 'Links', 'Check assigned links and document any issues', 'Quality', 12),
    (22, 'Forms', 'Review an assigned form for clear field labels', 'Quality', 15),
    (23, 'Images', 'Write alternative text for assigned images', 'Content', 15),
    (24, 'Release notes', 'Review a draft release note for accuracy', 'Content', 15),
    (25, 'Feedback', 'Categorise assigned feedback by product topic', 'Research', 15),
    (26, 'Workflow', 'Document an approved workflow step-by-step', 'Operations', 20),
    (27, 'Knowledge base', 'Check knowledge-base labels for consistency', 'Operations', 12),
    (28, 'Organisation', 'Organise assigned saved materials into categories', 'Productivity', 12),
    (29, 'Recovery', 'Review account-recovery instructions for clarity', 'Security', 10),
    (30, 'Phishing', 'Identify safe handling steps in a phishing awareness example', 'Security', 10),
    (31, 'Welcome', 'Prepare an approved welcome message for new members', 'Community', 8),
    (32, 'Guidelines', 'Complete the community-guidelines knowledge check', 'Community', 10),
    (33, 'Empty state', 'Review wording displayed when no data is available', 'Product testing', 8),
    (34, 'Filters', 'Test assigned catalog filters and record findings', 'Product testing', 12),
    (35, 'Mobile', 'Test an assigned task flow on a mobile screen', 'Quality', 12),
    (36, 'Desktop', 'Test an assigned task flow on a desktop screen', 'Quality', 12),
    (37, 'Copy', 'Suggest a clearer version of assigned interface copy', 'Content', 10),
    (38, 'Labels', 'Review assigned product labels for consistency', 'Catalog', 10),
    (39, 'Checklist', 'Complete an approved operational checklist', 'Operations', 15),
    (40, 'Retrospective', 'Summarise observations from an assigned workflow', 'Productivity', 20)
  ) AS t(task_number, label, description, category, minutes)
)
INSERT INTO tasks (title, description, category, membership_level, estimated_minutes)
SELECT format('VIP %s · Task %s: %s', level_number, task_number, label), description, category, level_number, minutes
FROM generate_series(1, 5) AS level_number CROSS JOIN task_templates
ORDER BY level_number, task_number;
