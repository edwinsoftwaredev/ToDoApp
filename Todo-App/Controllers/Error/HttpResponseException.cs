using System;

/*
 * use this class to throw a Http Error Response base on
 * the configuration for that purpose.
 **/
public class HttpResponseException : Exception {
    public int Status { get; set; } = 500;
    public object Value { get; set; }
}
