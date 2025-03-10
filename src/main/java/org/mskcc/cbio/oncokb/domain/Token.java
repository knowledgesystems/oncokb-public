package org.mskcc.cbio.oncokb.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A Token.
 */
@Entity
@Table(name = "token")
public class Token implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", length = 40)
    private String token;

    @Column(name = "creation")
    private Instant creation;

    @Column(name = "expiration")
    private Instant expiration;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @NotNull
    @Column(name = "current_usage", nullable = false)
    private Integer currentUsage = 0;

    @NotNull
    @Column(name = "renewable", nullable = false)
    private Boolean renewable = true;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JsonIgnoreProperties(value = "tokens", allowSetters = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public Token token(String token) {
        this.token = token;
        return this;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Instant getCreation() {
        return creation;
    }

    public Token creation(Instant creation) {
        this.creation = creation;
        return this;
    }

    public void setCreation(Instant creation) {
        this.creation = creation;
    }

    public Instant getExpiration() {
        return expiration;
    }

    public Token expiration(Instant expiration) {
        this.expiration = expiration;
        return this;
    }

    public void setExpiration(Instant expiration) {
        this.expiration = expiration;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public Token usageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
        return this;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Integer getCurrentUsage() {
        return currentUsage;
    }

    public Token currentUsage(Integer currentUsage) {
        this.currentUsage = currentUsage;
        return this;
    }

    public void setCurrentUsage(Integer currentUsage) {
        this.currentUsage = currentUsage;
    }

    public Boolean isRenewable() {
        return renewable;
    }

    public Token renewable(Boolean renewable) {
        this.renewable = renewable;
        return this;
    }

    public void setRenewable(Boolean renewable) {
        this.renewable = renewable;
    }

    public String getName() {
        return name;
    }

    public Token name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public Token user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Token)) {
            return false;
        }
        return id != null && id.equals(((Token) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Token{" +
            "id=" + getId() +
            ", token='" + getToken() + "'" +
            ", creation='" + getCreation() + "'" +
            ", expiration='" + getExpiration() + "'" +
            ", usageLimit=" + getUsageLimit() +
            ", currentUsage=" + getCurrentUsage() +
            ", renewable='" + isRenewable() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
